import { Tokens, UserLoginRespond, UserRefreshToken } from 'app-old/core/domain/entities';
import { ITokenService } from 'app-old/core/interfaces';
import { ClientMeta } from 'app-old/core/repositories/auth-repository/auth.service.interface';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

// TODO СТАРЫЙ СЕРВИС (DELETE)
export class TokenService implements ITokenService {
  generateTokens<T extends object>(payload: T): Tokens {
    throw new Error('Method not implemented.');
  }
  validateAccessToken(token: string): (UserLoginRespond & jwt.JwtPayload) | null {
    throw new Error('Method not implemented.');
  }
  validateRefreshToken(token: string): (UserLoginRespond & jwt.JwtPayload) | null {
    throw new Error('Method not implemented.');
  }
  findRefreshToken(userId: string, meta: ClientMeta): Promise<UserRefreshToken | null> {
    throw new Error('Method not implemented.');
  }
  saveRefreshToken(userId: string, refreshToken: string, meta: ClientMeta): Promise<UserRefreshToken | null> {
    throw new Error('Method not implemented.');
  }
  removeToken(refreshToken: string): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  removeTokenByUserId(id: string): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
}
