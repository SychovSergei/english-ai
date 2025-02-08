// export interface IUserSettings {
//   // owner: TOwner; // user index
//   defaultLanguage: string; // Основной язык
//   translationLanguage: string; // Язык для перевода
//   interfaceLanguage: string; // Язык для перевода
// }

import { UserSettings } from "../../server/src/infractructure/db/entities/schemas/user-settings-schema";

// export type IUserUpdateSettings = Omit<UserSettings, "owner">;
export type SharedUserSettings = UserSettings;
export type SharedUserUpdateSettings = UserSettings;
