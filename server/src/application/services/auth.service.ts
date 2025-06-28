import { DiTypes } from '@shared/types';
import { generateUuid } from '@shared/utils';
import { inject, injectable } from 'inversify';

import {
  ICreateUser,
  User,
  UserDataForTokensModify,
  UserLogin,
  userLoginSchema,
  UserRegister,
  UserRegisterResponse,
  userRegisterSchema,
  userSchema,
  UserSettings,
} from '@core/domain/entities';
import { Tokens } from '@core/domain/entities/';
import { EUserRole } from '@core/domain/enums';
import { AuthError, ErrorBody, UserError } from '@core/domain/errors';
import {
  IBcryptService,
  ITokenService,
  IUserService,
  IValidationService,
  IVerificationService,
} from '@core/interfaces';
import { IAuthService, IUserSettingsService } from '@core/repositories';
import { IConfigService } from '@application/ports/config-service.interface';

/**
 * AuthService is responsible for user authentication and authorization.
 * It handles user registration, login, logout, and token refresh operations.
 */
@injectable()
export class AuthService implements IAuthService {
  constructor(
    // @inject(DiTypes.ConfigService) private readonly configService: IConfigService,
    @inject(DiTypes.ConfigService) private configService: IConfigService,

    /** Сервис для отправки email-подтверждений */
    @inject(DiTypes.VerificationService) private verificationService: IVerificationService,

    @inject(DiTypes.UserService) private userService: IUserService, //TODO
    // private userService: UserService,

    @inject(DiTypes.ValidationService) private validationService: IValidationService,
    @inject(DiTypes.UserSettingsService) private userSettingsService: IUserSettingsService,
    @inject(DiTypes.BcryptService) private bcryptService: IBcryptService,

    @inject(DiTypes.TokenService) private tokenService: ITokenService, //TODO
    // private tokenService: TokenService,
  ) {}

  /**
   * Registers a new user in the system.
   * @param data - The user registration data
   * @returns An object containing the registered user's ID, name, and email
   * @throws UserError.AlreadyExists if a user with the same email already exists
   */
  async register(data: UserRegister): Promise<UserRegisterResponse> {
    const userRegisterValidatedData: UserRegister = this.validationService.validate<UserRegister>(
      data,
      userRegisterSchema,
      'user',
    );
    const { email: userEmail, password } = userRegisterValidatedData;

    await this.checkIfUserExists(userEmail);

    const settings = await this.userSettingsService.createSetting();

    const hashPassword: string = await this.bcryptService.hashPassword(password);
    const activationId: string = generateUuid();

    const createdUser = await this.createNewUser(data, settings.id!.toString(), hashPassword, activationId);

    await this.sendVerificationEmail(userEmail, activationId);

    const userValidatedData = this.validationService.validate<User>(createdUser, userSchema, 'user');
    const { id, name, email } = userValidatedData;

    return { id, name, email };
  }

  /**
   * Authenticates a user and generates access and refresh tokens.
   * @param data - The user's login credentials (email and password)
   * @returns A Tokens object containing access and refresh tokens
   * @throws UserError.NotFound if the user does not exist
   * @throws UserError.WrongPassword if the password is incorrect
   */
  public async login(data: UserLogin): Promise<Tokens> {
    const { email, password } = this.validationService.validate<UserLogin>(
      data,
      userLoginSchema,
      'Login data id incorrect - validation',
    );

    const user = await this.validateUserCredentials(email, password);
    const userSetting = await this.getUserSettings(user.settingsId!.toString(), user.email);
    const userWithSettings: UserDataForTokensModify = this.prepareUserData(user, userSetting);

    return await this.saveTokensWithData(userWithSettings);
  }

  /**
   * Logs out a user by removing their refresh token.
   * @param refreshToken - The refresh token to remove
   * @returns The removed token string or null if it was not found
   */
  public async logout(refreshToken: string): Promise<string | null> {
    return await this.tokenService.removeToken(refreshToken);
  }

  /**
   * Refreshes the user's authentication tokens using a valid refresh token.
   * @param refreshToken - The user's refresh token
   * @returns A new Tokens object with updated access and refresh tokens
   * @throws AuthError.UnauthorizedRefreshToken if the token is missing or invalid
   * @throws UserError.NotFound if the user or associated token is not found
   */
  public async refresh(refreshToken: string | undefined): Promise<Tokens> {
    if (!refreshToken) {
      throw AuthError.UnauthorizedRefreshToken('Refresh token is missing.');
    }

    /* проверяю токен на валидность  Refresh token is malformed or missing.*/
    const payload = this.tokenService.validateRefreshToken(refreshToken);
    if (!payload) {
      throw AuthError.UnauthorizedRefreshToken('Session is expired.');
    }

    const userId = payload.id?.toString();
    if (!userId) {
      throw AuthError.UnauthorizedRefreshToken('Invalid user ID in token.');
    }

    const userData = await this.tokenService.findRefreshToken(userId); // || ''
    if (!userData) throw UserError.NotFound();

    // const userId: string = userData.userId!.toString();
    const user = await this.userService.findById(userId);
    if (!user) {
      throw UserError.NotFound();
    }

    const settingsId = user.settingsId?.toString();
    if (!settingsId) {
      throw UserError.BadRequest('user', '', [{ path: ['settingsId'], message: 'Missing settingsId' }]);
    }

    const settings = await this.userSettingsService.getSettings(settingsId);
    if (!settings) UserError.BadRequest('user', '', [{ path: ['settings'], message: 'User settings not found' }]); //TODO create valid error

    const userDto: UserDataForTokensModify = this.prepareUserData(user, settings!);

    /*
    // const userDto: UserDataForTokensModify = {
    //   id: userUpdated._id?.toString() || userUpdated.id?.toString(),
    //   name: userUpdated.name,
    //   email: userUpdated.email,
    //   role: userUpdated.role,
    //   wordSets: userUpdated.wordSets, //.map((id: Types.ObjectId) => id.toString()),
    //   sharedWordSets: userUpdated.sharedWordSets, //.map((id: Types.ObjectId) => id.toString()),
    //   trainingSessions: userUpdated.trainingSessions, //.map((id: Types.ObjectId) => id.toString()),
    //   settings: userSetting!, //TODO ??????????????
    //   isActivated: userUpdated.isActivated,
    //   createdAt: userUpdated.createdAt,
    //   updatedAt: userUpdated.updatedAt,
    // };*/

    return await this.saveTokensWithData(userDto);
  }

  /**
   * Prepares user data for token generation by removing sensitive fields and attaching settings.
   * @param user - The user object
   * @param settings - The user's settings
   * @returns A sanitized UserDataForTokensModify object with settings
   */
  private prepareUserData(user: User, settings: UserSettings): UserDataForTokensModify {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { settingsId, password, activationId, ...rest } = user;

    return { ...rest, settings };
  }

  /**
   * Validates the user's credentials.
   * @param email - User email
   * @param password - User password
   * @returns The authenticated user
   * @throws UserError.NotFound if the user does not exist
   * @throws UserError.WrongPassword if the password is incorrect
   */
  private async validateUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw UserError.NotFound(email);
    }
    await this.checkPassword(password, user.password);

    return user;
  }

  /**
   * Checks if the provided password matches the hashed password.
   * @param password - Raw user password
   * @param userPassword - Hashed password stored in the database
   * @throws UserError.WrongPassword if passwords do not match
   */
  private async checkPassword(password: string, userPassword: string): Promise<void> {
    const isPassEquals: boolean = await this.bcryptService.checkPassword(password, userPassword);
    if (!isPassEquals) {
      throw UserError.WrongPassword();
    }
  }

  /**
   * Retrieves the user's settings by ID.
   * @param userSettingsId - ID of the user's settings
   * @param userEmail - User email (optional, for error context)
   * @returns The user's settings
   * @throws UserError.NotFound if settings are not found
   */
  private async getUserSettings(userSettingsId: string, userEmail?: string): Promise<UserSettings> {
    const setting = await this.userSettingsService.getSettings(userSettingsId);
    if (!setting) {
      const body: ErrorBody<{ message: string }> = { message: `Settings for user ${userEmail} not found` };
      UserError.NotFound(userEmail, body);
    }

    return setting as UserSettings;
  }

  /**
   * Sends a verification email to the user with an activation link.
   * @param email - Recipient email address
   * @param activationId - Activation ID used in the verification link
   */
  private async sendVerificationEmail(email: string, activationId: string): Promise<void> {
    const verificationLink = `${this.configService.get('common').client_url}/auth/user-activate/${activationId}`;
    await this.verificationService.sendVerificationMail(email, verificationLink);
  }

  /**
   * Finds a user by their email address.
   * @param email - User email
   * @returns The user object or null if not found
   */
  private async getUserByEmail(email: string): Promise<User | null> {
    return await this.userService.findByEmail(email);
  }

  /**
   * Checks whether a user with the given email already exists.
   * @param email - User email
   * @throws UserError.AlreadyExists if the user already exists
   */
  private async checkIfUserExists(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (user !== null) {
      UserError.AlreadyExists(email);
    }
  }

  /**
   * Creates a new user in the database.
   * @param data - Registration data
   * @param settingsId - ID of the user's settings
   * @param hashedPassword - Hashed user password
   * @param activationId - Activation ID for email verification
   * @returns The created user object
   * @throws UserError.BadRequest if user creation fails
   */
  private async createNewUser(
    data: UserRegister,
    settingsId: string,
    hashedPassword: string,
    activationId: string,
  ): Promise<User> {
    const newUser: ICreateUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: EUserRole.Student,
      settingsId: settingsId,
      activationId: activationId,
    };

    const createdUser = await this.userService.createUser(newUser);
    if (!createdUser) {
      throw UserError.BadRequest('user', 'Create user-model error.');
    }

    return createdUser;
  }

  /**
   * Generates tokens for the user and saves the refresh token.
   * @param userDto - User data used for token generation
   * @returns A Tokens object with generated access and refresh tokens
   */
  private async saveTokensWithData(userDto: UserDataForTokensModify): Promise<Tokens> {
    const tokens: Tokens = this.tokenService.generateTokens<UserDataForTokensModify>(userDto);
    const id = userDto.id?.toString() || ''; //!.toString(); // as string;
    await this.tokenService.saveRefreshToken(id, tokens.refreshToken);

    return tokens;
  }
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
