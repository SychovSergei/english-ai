import UserModel from "../../infractructure/db/entities/UserModel";
import { UserError } from "../errors/user-error";
import { DocResponseWithId } from "../../infractructure/interfaces--/mongo.interface";
import { User } from "../../infractructure/db/entities/schemas/user-schema";
import { injectable } from "inversify";
import { IUserRepository } from "../repositories/UserRepository/UserRepository";

// type ReplaceObjectIdWithString<T> = T extends Types.ObjectId
//   ? string
//   : T extends Date // Оставляем Date неизменным
//     ? Date
//     : T extends (...args: any[]) => any // Оставляем функции неизменными
//       ? T
//       : T extends Array<infer U> // Обрабатываем массивы
//         ? Array<ReplaceObjectIdWithString<U>>
//         : T extends object // Обрабатываем объекты
//           ? { [K in keyof T]: ReplaceObjectIdWithString<T[K]> }
//           : T; // Остальные типы остаются неизменными

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

@injectable()
export class UserService implements IUserRepository {
  /** async getAll(): Promise<UserDocument[]> { */
  async getAll(): Promise<User[]> {
    const users = await UserModel.find({}).lean().exec();

    return users;
  }

  async createUser(userData: User): Promise<User> {
    const newUser = new UserModel(userData);
    const savedUser = (await newUser.save()).toObject({ transform: true }); // //).toObject({ getters: true, transform: true }); //

    if (!savedUser) throw UserError.BadRequest("not-created", "user did not create");

    const id = savedUser._id?.toString().trim() || savedUser.id?.toString().trim();
    const user = await UserModel.findById(id).lean().exec();
    // .populate({ path: "settings", select: "-_id -__v" })
    // .lean()
    // .exec()) as DocResponseWithId<UserDataForTokensModify> | null;

    if (!user) throw UserError.NotFound(userData.email);

    const userBody: User = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      activationId: user.activationId,
      password: user.password,
      isActivated: user.isActivated,
      wordSets: user.wordSets, //.map((id: Types.ObjectId) => id.toString()),
      sharedWordSets: user.sharedWordSets, //.map((id: Types.ObjectId) => id.toString()),
      trainingSessions: user.trainingSessions, //.map((id: Types.ObjectId) => id.toString()),
      settings: user.settings, //.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }; // { ...savedUser, id: newUser._id }; //: WithId<User, string> .toString()

    return userBody; //userBody;
  }

  async checkUserByEmail(email: string): Promise<DocResponseWithId<User> | null> {
    return (await UserModel.findOne({ email: email }).lean().exec()) as DocResponseWithId<User> | null;
  }

  async findByEmail(email: string): Promise<DocResponseWithId<User> | null> {
    const user = (await UserModel.findOne({ email: email })) as DocResponseWithId<User> | null;
    if (!user) {
      throw UserError.NotFound();
    }

    return user;
  }

  async findById(id: string): Promise<DocResponseWithId<User> | null> {
    const user = (await UserModel.findById(id)) as DocResponseWithId<User> | null;
    if (!user) {
      throw UserError.NotFound();
    }

    return user;
  }
}
