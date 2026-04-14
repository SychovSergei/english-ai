import jwt from 'jsonwebtoken';

import { EUserRole } from '@core/domain/enums';

export interface TokenPayload extends jwt.JwtPayload {
  userId: string;
  role: EUserRole;
}

export interface TokenServicePort {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(): string;

  // generateTokens<T extends object>(payload: T): Tokens;
  // validateAccessToken(token: string): (UserLoginRespond & JwtPayload) | null;
  // validateRefreshToken(token: string): (UserLoginRespond & JwtPayload) | null;
  // findRefreshToken(userId: string, meta: ClientMeta): Promise<UserRefreshToken | null>;
  // saveRefreshToken(userId: string, refreshToken: string, meta: ClientMeta): Promise<UserRefreshToken | null>;
  // removeToken(refreshToken: string): Promise<string | null>;
  // removeTokenByUserId(id: string): Promise<string | null>;
}
