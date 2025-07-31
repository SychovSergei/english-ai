import { NextFunction, Response } from 'express';
import { getClientMeta } from '@shared/utils';

import { AuthError } from '@core/domain/errors';
import { ITokenRepositoryService } from '@core/repositories';
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
