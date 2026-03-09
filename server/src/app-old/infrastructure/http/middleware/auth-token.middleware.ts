import { ITokenService } from '@core/interfaces';
import { NextFunction, Response } from 'express';

import { AuthError } from '@modules/auth/domain/errors/AuthError';

import { CustomRequest } from 'infrastructure/http/interfaces';

export const authTokenMiddleware = (tokenService: ITokenService) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(AuthError.UnauthorizedAccessToken('Access token missing'));

    const accessToken = authHeader.split(' ')[1];

    try {
      const decodedAccess = tokenService.validateAccessToken(accessToken);

      if (!decodedAccess) return next(AuthError.UnauthorizedAccessToken('Access token invalid!!!'));

      req.user = decodedAccess; // Добавляем пользователя в запрос
      next();
    } catch {
      console.warn('Access Token недействителен');
      return next(AuthError.UnauthorizedAccessToken('Invalid access token'));
    }
  };
};
