import { model, Model, Schema, Types } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { EUserRole } from "@shared/enums/user-roles.enum";
import { IUserName } from "@shared/interfaces/user.interface";
import { User } from "./schemas/user-schema";
import { CustomZodObjectId } from "./schemas/custom-zod-validators";

const userNameSchema: Schema = new Schema<IUserName>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { _id: false },
);

type UserModel = Model<User>;
// Расширяем интерфейс для работы с Mongoose (Document)
export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

// const userSchema: Schema = new Schema<User, UserModel>(
// const userSchema: Schema = new Schema<UserDocument>(
const userSchema: Schema = new Schema<User>(
  {
    // id: { type: Schema.Types.ObjectId, required: false },
    // id: CustomZodObjectId.optional(),
    // _id: CustomZodObjectId.optional(),
    name: userNameSchema,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(EUserRole), default: EUserRole.Student },
    wordSets: [{ type: Schema.Types.ObjectId, ref: EDbModels.WordSet }],
    sharedWordSets: [{ type: Schema.Types.ObjectId, ref: EDbModels.WordSet }],
    // students: [{ type: Schema.Types.ObjectId, ref: EDbModels.User }],
    trainingSessions: [{ type: Schema.Types.ObjectId, ref: EDbModels.TrainingSession }], // Тренировки пользователя.
    settings: { type: Schema.Types.ObjectId, ref: EDbModels.UserSettings }, // Настройки пользователя.

    isActivated: { type: Boolean, required: true },
    activationId: { type: String, required: true },
    // createdAt: { type: Date, required: true },
    // updatedAt: { type: Date, required: true },
  },
  { timestamps: true },
  // {
  //   toObject: {
  //     virtuals: true,
  //     transform: (doc, ret) => {
  //       ret.id = ret._id?.toString(); // Добавляем id
  //       delete ret._id; // Убираем _id
  //       ret.wordSets = ret.wordSets.map((id: Types.ObjectId) => id.toString());
  //       ret.sharedWordSets = ret.sharedWordSets.map((id: Types.ObjectId) => id.toString());
  //       ret.trainingSessions = ret.trainingSessions.map((id: Types.ObjectId) => id.toString());
  //       ret.settings = ret.settings.toString();
  //       delete ret.__v; // Убираем __v
  //       return ret;
  //     },
  //   },
  // },
);
userSchema.set("toObject", {
  // virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// const UserModel: UserModel = model<User, UserModel>(EDbModels.User, userSchema);
// const UserModel: Model<UserDocument> = model<User, Model<UserDocument>>(EDbModels.User, userSchema);
const UserModel: UserModel = model<User, UserModel>(EDbModels.User, userSchema);

export default UserModel;
