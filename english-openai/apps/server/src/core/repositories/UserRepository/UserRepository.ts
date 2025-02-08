import { User } from "../../../infractructure/db/entities/schemas/user-schema";
import { DocResponseWithId } from "../../../infractructure/interfaces--/mongo.interface";
import { UserDocument } from "../../../infractructure/db/entities/UserModel";

export interface IUserRepository {
  // getAll(): Promise<UserDocument[]>;
  getAll(): Promise<User[]>;
  createUser(userData: User): Promise<User>;
  checkUserByEmail(email: string): Promise<DocResponseWithId<User> | null>;
  findByEmail(email: string): Promise<DocResponseWithId<User> | null>;
  findById(id: string): Promise<DocResponseWithId<User> | null>;
}
