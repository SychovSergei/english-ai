import { Request } from 'express';

export function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  // console.log('extractToken >>>>> header = ', header);
  if (!header || !header.startsWith('Bearer ')) return null;

  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token || token === 'null') return null;
  // console.log('extractToken >>>>> header token = ', token, typeof token);

  return token;
}
