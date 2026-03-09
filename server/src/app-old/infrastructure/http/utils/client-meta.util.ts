import { ClientMeta } from 'app-old/core/repositories/auth-repository/auth.service.interface';
import { CustomRequest } from 'app-old/infrastructure/http/interfaces';
// import { CustomRequest } from 'app-old/infrastructure/http/interfaces';

export function getClientMeta(req: CustomRequest): ClientMeta {
  return {
    origin: req.headers.origin || `${req.protocol}://${req.get('host')}`,
    userAgent: req.headers['user-agent'] || 'unknown',
  };
}
