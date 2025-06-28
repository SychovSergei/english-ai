import { Model, model, Schema } from 'mongoose';

import { UserSettings } from '@core/domain/entities';
import { ELangs } from '@core/domain/enums/langs.enum';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

type UserSettingsModel = Model<UserSettings>;

const userSettingSchema: Schema = new Schema<UserSettings, UserSettingsModel>({
  defaultLanguage: { type: String, enum: Object.values(ELangs), default: ELangs.EN },
  translationLanguage: { type: String, enum: Object.values(ELangs), default: ELangs.UA },
  interfaceLanguage: { type: String, enum: Object.values(ELangs), default: ELangs.UA },
});
userSettingSchema.set('toObject', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const UserSettingsModel: UserSettingsModel = model<UserSettings, UserSettingsModel>(
  EDbModels.UserSettings,
  userSettingSchema,
);

// export default UserSettingsModel;
