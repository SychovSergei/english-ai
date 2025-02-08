import { Validation } from "../../infractructure/services/validator";
import {
  User,
  UserDataForTokens,
  UserLogin,
  userLoginSchema,
  UserRegister,
  UserRegisterResponseClient,
  userRegisterSchema,
  userSchema,
} from "../../infractructure/db/entities/schemas/user-schema";
import { UserError } from "../errors/user-error";

import bcrypt from "bcrypt";
// import mailService from "./mail.service";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { EUserRole } from "@shared/enums/user-roles.enum";
import tokenService from "./token-service";
import UserModel from "../../infractructure/db/entities/UserModel";
import { AuthError } from "../errors/auth-error";
import { Tokens } from "../../infractructure/db/entities/schemas/token-schema";
import TokenModel from "../../infractructure/db/entities/TokenModel";
import { UserSettings } from "../../infractructure/db/entities/schemas/user-settings-schema";
import { DocResponseWithId } from "../../infractructure/interfaces--/mongo.interface";
import { IEmailService } from "../interfaces/mail-service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infractructure/di/types";
import { IAuthService } from "../repositories/AuthRepository/AuthRepository";
import { IUserRepository } from "../repositories/UserRepository/UserRepository";
import { IUserSettingsService } from "../repositories/UserSettingsRepository/UserSettingsRepository";
import { VerificationService } from "./VerificationService/VerificationService";

// type UserDataForTokensModify = Omit<UserDataForTokens, "settings"> & {
//   settings: UserSettings;
// };
export interface UserDataForTokensModify extends Omit<UserDataForTokens, "settings"> {
  settings: UserSettings;
}

// type TransformObjectIdToString<T> = {
//   [K in keyof T]: T[K] extends Types.ObjectId ? string : T[K] extends Types.ObjectId[] ? string[] : T[K];
// };

// function mapToInterface<T>(source: Record<string, any>): TransformObjectIdToString<T> {
//   const result: Partial<TransformObjectIdToString<T>> = {};
//
//   for (const key in source) {
//     if (key in result || Object.prototype.hasOwnProperty.call(result, key)) {
//       const value = source[key];
//
//       if (value instanceof Types.ObjectId) {
//         // Преобразование ObjectId в строку
//         result[key as keyof T] = value.toString() as any;
//       } else if (Array.isArray(value) && value[0] instanceof Types.ObjectId) {
//         // Преобразование массива ObjectId в массив строк
//         result[key as keyof T] = value.map((id) => id.toString()) as any;
//       } else {
//         // Оставляем значение без изменений
//         result[key as keyof T] = value;
//       }
//     }
//   }
//
//   return result as TransformObjectIdToString<T>;
// }

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.VerificationService) private verificationService: VerificationService,
    @inject(TYPES.UserService) private userService: IUserRepository,
    @inject(TYPES.UserSettingsService) private userSettingsService: IUserSettingsService,
  ) {}

  async register(data: UserRegister): Promise<UserRegisterResponseClient> {
    /** Валидирую данные */
    const userRegisterValidatedData = Validation.validate<UserRegister>(data, userRegisterSchema, "user");
    const { email, password } = userRegisterValidatedData;

    /** 1) проверить есть ли уже такой пользователь
     *  - если пользоватль есть то выдать ошибку AlreadyExists
     *  - если пользоватля нету то дальше */
    const userData = await this.userService.checkUserByEmail(email);
    if (userData !== null) {
      UserError.AlreadyExists(data.email);
    }

    /** сохраняю новые настройки для юзера */
    const settings = await this.userSettingsService.createSetting();

    /** 2) зашифровать пароль */
    const hashPassword: string = await bcrypt.hash(password, 10);
    const activationId: string = uuidv4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    const newUser: User = {
      // id: "",
      name: data.name,
      email: data.email,
      password: hashPassword,
      role: EUserRole.Student,
      wordSets: [],
      trainingSessions: [],
      sharedWordSets: [],
      settings: settings.id,
      activationId,
      isActivated: true, //TODO must be false + activation system
      createdAt,
      updatedAt,
    };

    /** 3) сохранить пользователя в базу : DocResponseWithId<User> | null*/
    const createdUser = await this.userService.createUser(newUser);
    if (!createdUser) {
      throw UserError.BadRequest("user", "Create User error.");
    }

    /** 4) отправить сообщение на Email */
    const verificationLink = `${config.common.client_url}/auth/user-activate/${activationId}`;
    // await this.mailService.sendVerificationMail(email, verificationLink);
    await this.verificationService.sendVerificationMail(email, verificationLink);

    const userValidatedData = Validation.validate<User>(createdUser, userSchema, "user");

    /** 5) генерация токенов : */
    const userFromDbDto = {
      ...userValidatedData,
      id: userValidatedData.id,
    } as UserRegisterResponseClient; // id: true, name: true, email: true

    return userFromDbDto;
  }

  async login(data: UserLogin): Promise<Tokens> {
    /** Валидирую данные */
    const userLoginValidatedData = Validation.validate<UserLogin>(
      data,
      userLoginSchema,
      "user login data is incorrect validation",
    );
    const { email, password } = userLoginValidatedData;

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      throw UserError.NotFound(data.email);
    }
    /** Check password */
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw UserError.WrongPassword();
    }

    console.log(">> user.id", user.settings?.toString());
    const userWithSettings = (await UserModel.findOne({ email })
      .populate({ path: "settings", select: "-_id -__v" })
      .lean()
      .exec()) as DocResponseWithId<UserDataForTokensModify> | null;
    console.log(">> userWithSettings", userWithSettings?.settings);
    if (!userWithSettings) {
      throw UserError.NotFound(email);
    }
    // const userFiltered = mapToInterface<UserDataForTokens>(user);
    // TODO UserDto class
    const userForTokens: UserDataForTokensModify = {
      id: userWithSettings._id.toString(), //
      name: userWithSettings.name,
      email: userWithSettings.email,
      role: userWithSettings.role,
      isActivated: userWithSettings.isActivated,
      wordSets: userWithSettings.wordSets, //?.map((id: Types.ObjectId) => id.toString()),
      sharedWordSets: userWithSettings.sharedWordSets, //.map((id: Types.ObjectId) => id.toString()),
      trainingSessions: userWithSettings.trainingSessions, //.map((id: Types.ObjectId) => id.toString()),
      settings: userWithSettings.settings, //user.settings.toString(),
      createdAt: userWithSettings.createdAt,
      updatedAt: userWithSettings.updatedAt,
    }; // as UserDataForTokens;

    const tokens = {
      ...(await this._saveTokensWithData(userForTokens)),
    };

    return tokens;
  }

  async logout(refreshToken: string): Promise<string | null> {
    return await tokenService.removeToken(refreshToken);
  }

  // async refresh(refreshToken: string | undefined): Promise<IUserRespond<UserDto>> {
  async refresh(refreshToken: string | undefined): Promise<Tokens> {
    if (!refreshToken) {
      throw AuthError.UnauthorizedRefreshToken("Refresh token is missing.");
    }

    /** проверяю токен на валидность  Refresh token is malformed or missing.*/
    const payloadUserData = tokenService.validateRefreshToken(refreshToken);
    if (!payloadUserData) {
      throw AuthError.UnauthorizedRefreshToken("Session is expired.");
    }
    // TODO check userData with zod schema (apply 'as Type')

    const userData = await TokenModel.findOne({ userId: payloadUserData.id }).lean();
    if (!userData) throw UserError.NotFound();

    /** проверяю есть ли токен в базе данных */
    const tokenFromDb = await tokenService.findRefreshToken(userData.userId.toString());

    /** if token invalid or if token does not exist at the database */
    if (!payloadUserData || !tokenFromDb) {
      throw AuthError.UnauthorizedRefreshToken("Session is expired. Please, login again.");
    }
    /** if refresh token is valid and user is valid
     *  -> get actual user info from DB and update tokens in DB */
    const user = (await UserModel.findById(userData.userId)
      .populate({ path: "settings", select: "-_id -__v" })
      .lean()
      .exec()) as DocResponseWithId<UserDataForTokensModify> | null;
    if (!user) {
      throw UserError.NotFound();
    }

    //TODO UserDto class
    const userDto: UserDataForTokensModify = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wordSets: user.wordSets, //.map((id: Types.ObjectId) => id.toString()),
      sharedWordSets: user.sharedWordSets, //.map((id: Types.ObjectId) => id.toString()),
      trainingSessions: user.trainingSessions, //.map((id: Types.ObjectId) => id.toString()),
      settings: user.settings,
      isActivated: user.isActivated,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return await this._saveTokensWithData(userDto);
  }

  // private async _saveTokensWithData(userDto: UserDataForTokens): Promise<Tokens> {
  private async _saveTokensWithData(userDto: UserDataForTokensModify): Promise<Tokens> {
    const tokens: Tokens = tokenService.generateTokens<UserDataForTokensModify>(userDto);
    const id = userDto.id?.toString() || ""; //!.toString(); // as string;
    await tokenService.saveToken(id, tokens.refreshToken);

    return tokens;
  }
}

// export default AuthService;
