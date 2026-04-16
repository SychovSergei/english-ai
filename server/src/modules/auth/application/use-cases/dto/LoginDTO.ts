import { EUserRole } from '@core/domain/enums';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: EUserRole;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: EUserRole;
  };
}
