import { IJwtService } from 'app-old/core/interfaces/jwt.service.interface';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

// TODO СТАРЫЙ СЕРВИС (DELETE)
export class JwtService implements IJwtService {
  createToken<T extends object>(payload: T, secretKey: string, options?: SignOptions): string {
    return jwt.sign(payload, secretKey, options);
  }

  verifyToken<T>(token: string, secretKey: string): (T & JwtPayload) | null {
    return jwt.verify(token, secretKey, { complete: true }).payload as T & JwtPayload;
  }
}
