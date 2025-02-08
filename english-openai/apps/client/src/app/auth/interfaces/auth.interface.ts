import { User } from '../../core/interfaces/user.interface';

export interface IAuthLogin extends ITokens {
  user: User;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
