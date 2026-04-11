import { ELangs } from '@shared/enums';

interface UserBase {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly isActivated: boolean;
}

export interface UserDto extends UserBase {
  readonly id: string;
  readonly settings: UserSettingsDto;

  readonly updatedAt?: number;
}

export interface UserSettingsDto {
  readonly defaultLanguage: ELangs;
  readonly translationLanguage: ELangs;
  readonly interfaceLanguage: ELangs;
}

export type CreateUserPayload = UserBase & {
  settings: UserSettingsDto;
};

export type UpdateUserPayload = UserBase & {
  settings: UserSettingsDto;
};
