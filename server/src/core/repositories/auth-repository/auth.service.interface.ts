import { Tokens } from '@core/domain/entities';
import { UserLogin, UserRegister, UserRegisterResponse } from '@core/domain/entities';

export interface IAuthService {
  register(data: UserRegister): Promise<UserRegisterResponse>;
  login(data: UserLogin, meta: ClientMeta): Promise<Tokens>;
  logout(refreshToken: string): Promise<string | null>;
  refresh(refreshToken: string | undefined, meta: ClientMeta): Promise<Tokens>;
}

export interface ClientMeta {
  origin: string;
  userAgent: string;
}
