import { EUserRole } from '@shared/enums';

export interface IUser {
  id?: string;
  name: IUserName;
  email: string;
  password?: string;
  role: EUserRole;
  wordSets?: string[];
  sharedWordSets?: string[];
  trainingSessions?: string[];
  settings?: string;
  isActivated: boolean;
  activationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserName {
  firstName: string;
  lastName: string;
}
