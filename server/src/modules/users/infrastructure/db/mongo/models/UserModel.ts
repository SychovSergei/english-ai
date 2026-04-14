import { HydratedDocument, model, Schema, Types } from 'mongoose';

import { ELangs, EUserRole } from '@core/domain/enums';
import { UserSettings } from '@modules/users/domain/value-objects';

/**
 * User document in Mongo
 */
export interface UserPersistence {
  _id: string; //Types.ObjectId;

  name: { firstName: string; lastName: string };
  email: string;
  role: EUserRole;

  passwordHash: string;

  isActivated: boolean;
  activationId?: string;

  settings: {
    defaultLanguage: ELangs;
    translationLanguage: ELangs;
    interfaceLanguage: ELangs;
  }; //Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const USER_MODEL_NAME = 'User';

export type UserDocument = HydratedDocument<UserPersistence>;

const UserSchema = new Schema<UserPersistence>(
  {
    _id: { type: String, required: true }, // Явно указываем String и отключаем автогенерацию [2]

    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: { type: String, enum: Object.values(EUserRole), default: EUserRole.STUDENT },
    isActivated: { type: Boolean, default: false },
    activationId: { type: String },
    // settingsId: { type: String, ref: 'Settings' }, //{ type: Schema.Types.ObjectId, ref: 'Settings' },
    settings: {
      defaultLanguage: {
        type: String,
        enum: Object.values(ELangs),
        default: ELangs.EN,
        required: true,
      },
      translationLanguage: {
        type: String,
        enum: Object.values(ELangs),
        default: ELangs.UA,
        required: true,
      },
      interfaceLanguage: {
        type: String,
        enum: Object.values(ELangs),
        default: ELangs.UA,
        required: true,
      },
    },
  },
  { _id: false, timestamps: true }, // Важно: _id: false, так как мы передаем свой [2]
);

export const UserModel = model<UserPersistence>(USER_MODEL_NAME, UserSchema);
