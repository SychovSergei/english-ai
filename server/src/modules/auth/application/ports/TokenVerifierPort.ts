import jwt from 'jsonwebtoken';

import { TokenPayload } from '@modules/auth/application/ports/TokenServicePort';

interface JwtPayloadWithRole extends jwt.JwtPayload {
  sub: string;
  role: string;
}

export function isValidPayload(payload: unknown): payload is JwtPayloadWithRole {
  console.log(
    'isValidPayload check ====',
    payload === 'object',
    payload !== null,
    typeof (payload as any).sub === 'string',
    typeof (payload as any).role === 'string',
  );
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as any).sub === 'string' &&
    typeof (payload as any).role === 'string'
  );
}

export interface TokenVerifierPort {
  verify(token: string): TokenPayload;
}
