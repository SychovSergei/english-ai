import { Document } from "mongoose";
import UserModel from "../models/user.model";
import { IUser } from "../models/interfaces/user.interface";
import { UserErrors } from "../errors/user-errors";

export class UserService {
  async getAll() {
    const users = await UserModel.find({});
    console.log(users);
    return users;
  }

  async findByEmail(email: string): Promise<(IUser & Document) | null> {
    const user = (await UserModel.findOne({ email: email })) as (Document & IUser) | null;
    console.log("findByEmail user = ", user);
    if (!user) {
      throw UserErrors.NotFound();
    }
    return user;
  }

  async findById(id: string): Promise<(IUser & Document) | null> {
    const user = (await UserModel.findById(id)) as (Document & IUser) | null;
    console.log("findById user = ", user);
    if (!user) {
      throw UserErrors.NotFound();
    }
    return user;
  }

  // async update(id: string, data: any) {}
}

export default new UserService();
