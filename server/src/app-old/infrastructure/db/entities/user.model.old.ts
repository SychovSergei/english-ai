import { Model, model, Schema } from 'mongoose';

import { User } from '@core/domain/entities';
import { EUserRole } from '@core/domain/enums';
import { EDbModels } from '@core/domain/enums/db-models.enum';

interface IUserName {
  firstName: string;
  lastName: string;
}

const userNameSchema: Schema = new Schema<IUserName>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { _id: false },
);

type UserModelOld = Model<User>;
// Расширяем интерфейс для работы с Mongoose (Document)
// export interface UserDocument extends user-model, Document {
//   _id: Types.ObjectId;
// }

const userSchema: Schema = new Schema<User>(
  {
    // id: { type: Schema.Types.ObjectId, required: false },
    // id: CustomZodObjectId.optional(),
    // _id: CustomZodObjectId.optional(),
    name: userNameSchema,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(EUserRole), default: EUserRole.STUDENT },
    wordSets: [{ type: Schema.Types.ObjectId, ref: EDbModels.WordSet }],
    sharedWordSets: [{ type: Schema.Types.ObjectId, ref: EDbModels.WordSet }],
    // students: [{ type: Schema.Types.ObjectId, ref: EDbModels.user-model }],
    trainingSessions: [{ type: Schema.Types.ObjectId, ref: EDbModels.TrainingSession }], // Тренировки пользователя.
    settingsId: { type: Schema.Types.ObjectId, ref: EDbModels.UserSettings }, // Настройки пользователя.

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
userSchema.set('toObject', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const UserModelOld: UserModelOld = model<User, UserModelOld>(EDbModels.UserOld, userSchema);
