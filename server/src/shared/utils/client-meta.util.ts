import { ClientMeta } from '@core/repositories/auth-repository/auth.service.interface';
import { CustomRequest } from '@infrastructure/http/interfaces';

export function getClientMeta(req: CustomRequest): ClientMeta {
  return {
    origin: req.headers.origin || `${req.protocol}://${req.get('host')}`,
    userAgent: req.headers['user-agent'] || 'unknown',
  };
}
