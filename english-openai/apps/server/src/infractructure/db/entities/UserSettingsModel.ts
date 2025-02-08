import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ELangs } from "@shared/enums/langs.enum";
import { UserSettings } from "./schemas/user-settings-schema";

type UserSettingsModel = Model<UserSettings>;

const userSettingSchema: Schema = new Schema<UserSettings, UserSettingsModel>({
  defaultLanguage: { type: String, enum: Object.values(ELangs), default: ELangs.EN },
  translationLanguage: { type: String, enum: Object.values(ELangs), default: ELangs.UA },
  interfaceLanguage: { type: String, enum: Object.values(ELangs), default: ELangs.UA },
});

const UserSettingsModel: UserSettingsModel = model<UserSettings, UserSettingsModel>(
  EDbModels.UserSettings,
  userSettingSchema,
);

export default UserSettingsModel;
