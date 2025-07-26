import { EUserRole } from '@shared/enums';
import { UserSettings } from '@shared/interfaces';

export type IUserLoginDTO = {
  email: string;
  password: string;
};

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken?: string;
  // user?: any; // Можно заменить на IUserShort или IUserSafe, если надо
};

export interface IUserRegisterDTO {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
}

export type IUserRegisterResponse = {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
};

export interface IUserTokenPayload {
  id?: string;
  name: IUserTokenPayloadName;
  email: string;
  // password: string; // TODO DELETE
  role: EUserRole;
  wordSets?: string[];
  sharedWordSets?: string[];
  trainingSessions?: string[];
  settings?: UserSettings;
  isActivated: boolean;
  activationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserTokenPayloadName {
  firstName: string;
  lastName: string;
}
