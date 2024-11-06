import UserModel from "../models/user.model";
import { IUser } from "../models/interfaces/user.interface";
import { UserError } from "../errors/user-error";
import { DocResponseWithId } from "../models/interfaces/mongo.interface";

export class UserService {
  async getAll() {
    const users = await UserModel.find({});
    console.log(users);
    return users;
  }

  async findByEmail(email: string): Promise<DocResponseWithId<IUser> | null> {
    const user = (await UserModel.findOne({ email: email })) as DocResponseWithId<IUser> | null;
    console.log("findByEmail user = ", user);
    if (!user) {
      throw UserError.NotFound();
    }
    return user;
  }

  async findById(id: string): Promise<DocResponseWithId<IUser> | null> {
    const user = (await UserModel.findById(id)) as DocResponseWithId<IUser> | null;
    console.log("findById user = ", user);
    if (!user) {
      throw UserError.NotFound();
    }
    return user;
  }

  // async update(id: string, data: any) {}
}

export default new UserService();
