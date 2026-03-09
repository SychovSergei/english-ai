import { IUserService } from '@core/interfaces';
import { IUserRepositoryService } from '@core/repositories';
import { inject, injectable } from 'inversify';

import { ICreateUser, User } from 'app-old/core/domain/entities';

import { DiTypes } from '@ioc/di.types';
// import { UserDataForTokensModify } from "@application/services/AuthService";

// export interface ICreateUser {
//   name: UserName;
//   email: string;
//   password: string;
//   role: EUserRole;
//   settingsId: string;
//   activationId: string;
// }

// export class UserService implements IUserRepositoryService {
@injectable()
export class UserService implements IUserService {
  constructor(@inject(DiTypes.UserRepository) private userRepositoryService: IUserRepositoryService) {}

  /** async getAll(): Promise<UserDocument[]> { */
  async getAll(): Promise<User[]> {
    return await this.userRepositoryService.getAll();
    //TODO must use UserRepo Service - DONE
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepositoryService.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepositoryService.findById(id);
  }

  // async getUserForTokenByEmail(email: string): Promise<UserDataForTokensModify | null> {
  //   return await this.userRepositoryService.getUserForTokenByEmail(email);
  // }

  async createUser(userData: ICreateUser): Promise<User> {
    const createdAt = new Date();
    const updatedAt = createdAt;

    const newUser: User = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      settingsId: userData.settingsId,
      activationId: userData.activationId,

      wordSets: [],
      trainingSessions: [],
      sharedWordSets: [],
      isActivated: true, //TODO must be false + activation system
      createdAt,
      updatedAt,
    };
    return await this.userRepositoryService.createUser(newUser);
  }

  /**
   async findByEmail(email: string): Promise<DocResponseWithId<user-model> | null> {
    const user = (await user-model.findOne({ email: email })) as DocResponseWithId<user-model> | null;
    if (!user) {
      throw UserError.NotFound();
    }

    return user;
  }


   */
}

// function convertObjectIdToString<T>(obj: T): ReplaceObjectIdWithString<T> {
//   if (obj === null || typeof obj !== "object") {
//     return obj as ReplaceObjectIdWithString<T>;
//   }
//
//   if (Array.isArray(obj)) {
//     return obj.map((item) => convertObjectIdToString(item)) as ReplaceObjectIdWithString<T>;
//   }
//
//   const newObj: any = {};
//
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       const value = obj[key];
//
//       if (value instanceof Types.ObjectId) {
//         newObj[key] = value.toString();
//       } else if (Array.isArray(value)) {
//         newObj[key] = value.map((item) =>
//           item instanceof Types.ObjectId ? item.toString() : convertObjectIdToString(item),
//         );
//       } else if (value && typeof value === "object") {
//         newObj[key] = convertObjectIdToString(value);
//       } else {
//         newObj[key] = value;
//       }
//     }
//   }
//
//   return newObj as ReplaceObjectIdWithString<T>;
// }
