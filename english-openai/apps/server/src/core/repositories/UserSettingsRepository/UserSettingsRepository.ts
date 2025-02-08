import { UserSettings } from "../../../infractructure/db/entities/schemas/user-settings-schema";

export interface IUserSettingsService {
  getSettings(): Promise<UserSettings>;
  createSetting(): Promise<UserSettings>;
  updateSettings(newSettings: Partial<UserSettings>): Promise<UserSettings>;
}
