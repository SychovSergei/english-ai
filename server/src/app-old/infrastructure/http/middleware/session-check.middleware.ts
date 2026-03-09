import { ITokenRepositoryService } from '@core/repositories';
import { NextFunction, Response } from 'express';

import { AuthError } from '@modules/auth/domain/errors/AuthError';

import { getClientMeta } from 'app-old/infrastructure/http/utils/client-meta.util';
import { CustomRequest } from '@infrastructure/http/interfaces';

export const sessionCheckMiddleware = (sessionService: ITokenRepositoryService) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(AuthError.UnauthorizedRefreshToken('Refresh token missing'));

    const meta = getClientMeta(req);
    const userSession = await sessionService.findByUserId(req.user!.id!.toString(), meta);

    if (!userSession) {
      return next(AuthError.UnauthorizedRefreshToken('Session expired'));
    }

    next();
  };
};
