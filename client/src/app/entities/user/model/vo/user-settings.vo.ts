import { ELangs } from '@shared/enums/langs.enum';

export class UserSettings {
  // id?: string;
  private constructor(
    public readonly defaultLanguage: ELangs, // Основной язык
    public readonly translationLanguage: ELangs, // Язык для перевода
    public readonly interfaceLanguage: ELangs, // Язык для перевода}
  ) {}

  static createDefault(): UserSettings {
    return new UserSettings(ELangs.EN, ELangs.UA, ELangs.UA);
  }

  isDefault(lang: ELangs): boolean {
    return this.defaultLanguage === lang;
  }
}
