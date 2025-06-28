import { JwtPayload } from 'jsonwebtoken';

import { Tokens, UserLoginRespond, UserRefreshToken } from '@core/domain/entities';

export interface ITokenService {
  generateTokens<T extends object>(payload: T): Tokens;
  validateAccessToken(token: string): (UserLoginRespond & JwtPayload) | null;
  validateRefreshToken(token: string): (UserLoginRespond & JwtPayload) | null;
  findRefreshToken(userId: string): Promise<UserRefreshToken | null>;
  saveRefreshToken(userId: string, refreshToken: string): Promise<UserRefreshToken | null>;
  removeToken(refreshToken: string): Promise<string | null>;
  removeTokenByUserId(id: string): Promise<string | null>;
}
