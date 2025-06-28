import { EUserRole } from '@shared/enums';

export interface IUserTokenPayload {
  id?: string;
  name: IUserTokenPayloadName;
  email: string;
  password: string;
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

interface IUserTokenPayloadName {
  firstName: string;
  lastName: string;
}
