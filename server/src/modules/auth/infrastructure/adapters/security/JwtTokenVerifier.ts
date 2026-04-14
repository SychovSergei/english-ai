import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { ConfigServicePort } from '@core/application/ports';
import { TokenPayload } from '@modules/auth/application/ports/TokenServicePort';
import { TokenVerifierPort } from '@modules/auth/application/ports/TokenVerifierPort';

import { CORE_TYPES } from '@core/constants/types';

@injectable()
export class JwtTokenVerifier implements TokenVerifierPort {
  private readonly _secret: string;

  constructor(@inject(CORE_TYPES.ConfigService) private configService: ConfigServicePort) {
    // this.secret = this.configService.get('jwt').jwtSecret; //getJwtSecret();
    this._secret = this.configService.get('jwt').accessKey; //getJwtSecret();
  }

  verify(token: string): TokenPayload {
    // verify(token: string): any {
    // console.log('JwtTokenVerifier -> verify - this.secret ====', this.secret);
    console.log('JwtTokenVerifier -> verify - token ====', token.slice(0, 15));
    // const payload = jwt.verify(token, this.secret);

    const decoded = jwt.verify(token, this._secret);
    console.log('JwtTokenVerifier -> verify - decoded', decoded);
    console.log('typeof decoded === object / decoded !== null', typeof decoded === 'object', decoded !== null);

    if (typeof decoded === 'object' && decoded !== null) {
      const payload = decoded as TokenPayload;
      // Теперь payload строго типизирован
      console.log('payload', payload);
      console.log('user id ======', payload.userId);
      if (payload.exp && payload?.iat) {
        if (payload.exp * 1000 - new Date().getTime() > 0) {
          // console.log('==== token EXPIRED IN ====', payload.exp * 1000, new Date().getTime());
          console.log(
            '==== token WILL EXPIRE IN ====',
            Math.round((payload.exp * 1000 - new Date().getTime()) / 1000),
            'seconds',
          );
        } else {
          console.log('==== token HAS ALREADY EXPIRED ====');
        }
      }

      return {
        userId: payload.userId,
        // userId: payload.sub!,
        role: payload.role,
      };
    } else {
      throw new Error('Invalid token payload structure');
    }
  }
}
