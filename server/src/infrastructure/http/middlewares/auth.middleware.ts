// import { NextFunction, Request, Response } from 'express';
//
// // import { requestContext } from '@core/application/context/RequestContext';
// import { UserActor } from '@core/application/identity/UserActor';
// import { TokenVerifier } from '@core/application/ports/auth/TokenVerifier';
//
// import { extractToken } from '@infrastructure/http/auth/extract-token';
// import { requestContext } from '@infrastructure/http/context/RequestContext';
// // import { requestContext } from '@infrastructure/http/context/RequestContext';
//
// export function authMiddleware(
//   tokenVerifier: TokenVerifier,
// ): (req: Request, res: Response, next: NextFunction) => void {
//   return (req, res, next) => {
//     const store = requestContext.getStore();
//     if (!store) return next();
//
//     const token = extractToken(req);
//     if (!token) return next();
//
//     const payload = tokenVerifier.verify(token);
//     store.actor = new UserActor(payload.userId, payload.role);
//
//     next();
//   };
// }
