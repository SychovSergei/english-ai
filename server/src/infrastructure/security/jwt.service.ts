import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

import { IJwtService } from '@core/interfaces/jwt.service.interface';

export class JwtService implements IJwtService {
  createToken<T extends object>(payload: T, secretKey: string, options?: SignOptions): string {
    return jwt.sign(payload, secretKey, options);
  }

  verifyToken<T>(token: string, secretKey: string): (T & JwtPayload) | null {
    return jwt.verify(token, secretKey, { complete: true }).payload as T & JwtPayload;
  }

  // createRefreshToken<T extends object>(payload: T): string {
  //   return jwt.sign(payload, config.jwt.refresh_key!, { expiresIn: "2h" });
  // }
}
