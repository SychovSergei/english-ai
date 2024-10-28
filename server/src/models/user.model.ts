import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { IUser, IUserName } from "./interfaces/user.interface";

type UserModel = Model<IUser>;

const userNameSchema: Schema = new Schema<IUserName>({
  firstName: { type: String, required: true },
  lastName: { type: String },
});

const userSchema: Schema = new Schema<IUser, UserModel>({
  userName: [userNameSchema],
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel: UserModel = model<IUser, UserModel>(EDbModels.User, userSchema);

export default UserModel;
