import { UserRefreshToken } from 'app-old/core/domain/entities';
import { ClientMeta } from 'app-old/core/repositories/auth-repository/auth.service.interface';

export interface ITokenRepositoryService {
  findByUserId(userId: string, meta: ClientMeta): Promise<UserRefreshToken | null>;
  createToken(userId: string, refreshToken: string, meta: ClientMeta): Promise<UserRefreshToken>;
  updateToken(userId: string, refreshToken: string): Promise<UserRefreshToken | null>;
  removeTokenByValue(refreshToken: string): Promise<UserRefreshToken | null>;
  removeTokenByUserId(userId: string): Promise<UserRefreshToken | null>;
}
