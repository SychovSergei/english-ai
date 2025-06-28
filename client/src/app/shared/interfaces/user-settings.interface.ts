import { ELangs } from '@shared/enums/langs.enum';

export interface UserSettings {
  id?: string;
  defaultLanguage: ELangs; // Основной язык
  translationLanguage: ELangs; // Язык для перевода
  interfaceLanguage: ELangs; // Язык для перевода}
}

export type UserUpdateSettings = UserSettings;
