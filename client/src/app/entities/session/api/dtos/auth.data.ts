import { EUserRole } from '@shared/enums';
import { UserRole } from '@shared/enums/user-roles.enum';

export type LoginPayload = {
  email: string;
  password: string;
};

// TODO user: { id: string; email: string; role: EUserRole };
//  accessToken: string;
//  refreshToken: string;

export type AuthData = {
  user: { id: string; email: string; role: EUserRole };
  accessToken: string;
};

export interface RegisterPayload {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
}

export type RegisterResponseDto = {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
};

export interface SessionResponse {
  userId?: string;
  guestId?: string;
  accessToken: string;
  role?: UserRole; //'admin' | 'teacher' | 'student' | 'guest';
}
