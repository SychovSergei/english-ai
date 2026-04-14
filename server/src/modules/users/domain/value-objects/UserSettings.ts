import { ValueObject } from '@core/domain/base/ValueObject';
import { ELangs } from '@core/domain/enums';

export type UserSettingsProps = {
  defaultLanguage: ELangs;
  translationLanguage: ELangs;
  interfaceLanguage: ELangs;
};

export class UserSettings extends ValueObject<UserSettingsProps> {
  private constructor(props: UserSettingsProps) {
    super(props);
  }

  public static create(props: UserSettingsProps): UserSettings {
    return new UserSettings(props);
  }

  // TODO Геттеры для удобства

  public update(newProps: Partial<UserSettingsProps>): UserSettings {
    return UserSettings.create({ ...this.props, ...newProps });
  }

  static createDefault(): UserSettings {
    return UserSettings.create({
      defaultLanguage: ELangs.EN,
      translationLanguage: ELangs.RU,
      interfaceLanguage: ELangs.EN,
    });
  }
}
