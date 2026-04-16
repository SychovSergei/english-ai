import { inject, injectable } from 'inversify';
import jwt, { SignOptions } from 'jsonwebtoken';

import { AuthError } from '@modules/auth/domain/errors/AuthError';

import { ConfigServicePort } from '@core/application/ports';
import { TokenPayload, TokenServicePort } from '@modules/auth/application/ports/TokenServicePort';
import { TokenVerifierPort } from '@modules/auth/application/ports/TokenVerifierPort';

import { CORE_TYPES } from '@core/constants/types';

@injectable()
export class JwtTokenService implements TokenServicePort, TokenVerifierPort {
  constructor(
    @inject(CORE_TYPES.ConfigService) private configService: ConfigServicePort,
    // @inject(DiTypes.JwtService) private jwtService: IJwtService,
    // @inject(DiTypes.TokenRepositoryService) private tokenRepo: SessionRepository,
  ) {}

  generateAccessToken(payload: TokenPayload): string {
    const jwtConfig = this.configService.get('jwt');
    if (!jwtConfig.accessKey) throw new Error('Access key is not defined');

    return this.createToken(payload, jwtConfig.accessKey, {
      expiresIn: jwtConfig.accessKeyExpiresInSec, //.env ACCESS_TOKEN_LIFETIME_SEC
    });
  }

  generateRefreshToken(): string {
    // Рефреш-токен может быть просто случайной строкой
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public verify(token: string): TokenPayload {
    try {
      const jwtConfig = this.configService.get('jwt');
      if (!jwtConfig.accessKey) throw new Error('Access key is not defined');
      console.log('JwtTokenService ->>> verify -> jwtConfig.accessKey', jwtConfig.accessKey);

      return jwt.verify(token, jwtConfig.accessKey, { complete: true }).payload as TokenPayload;
    } catch (e) {
      throw AuthError.Unauthorized('Invalid or expired token');
    }
    // return jwt.verify(token, secretKey, { complete: true }).payload as T & JwtPayload;
  }

  private createToken<T extends object>(payload: T, secretKey: string, options?: SignOptions): string {
    return jwt.sign(payload, secretKey, options);
  }
}
