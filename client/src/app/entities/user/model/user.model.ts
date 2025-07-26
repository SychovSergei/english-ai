import { EUserRole } from '@shared/enums';
import { UserSettings } from '@shared/interfaces';

export interface IUser {
  id?: string;
  name: IUserName;
  email: string;
  password?: string;
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

export interface IUserName {
  firstName: string;
  lastName: string;
}
