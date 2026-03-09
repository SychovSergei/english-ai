import { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface IJwtService {
  createToken<T extends object>(payload: T, secretKey: string, options?: SignOptions): string;
  verifyToken<T>(token: string, secretKey: string): (T & JwtPayload) | null;
}
