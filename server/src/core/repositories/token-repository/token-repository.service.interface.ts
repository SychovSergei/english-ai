import { UserRefreshToken } from '@core/domain/entities';

export interface ITokenRepositoryService {
  findByUserId(userId: string): Promise<UserRefreshToken | null>;
  createToken(userId: string, refreshToken: string): Promise<UserRefreshToken>;
  updateToken(userId: string, refreshToken: string): Promise<UserRefreshToken | null>;
  removeTokenByValue(refreshToken: string): Promise<UserRefreshToken | null>;
  removeTokenByUserId(userId: string): Promise<UserRefreshToken | null>;
}
