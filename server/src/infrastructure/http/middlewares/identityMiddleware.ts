import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TokenLifetime } from '@modules/auth/domain/value-objects/TokenLifetime';

import { GuestActor } from '@core/application/identity/GuestActor';
import { ConfigServicePort } from '@core/application/ports';

import { ActorResolver } from '@infrastructure/auth/ActorResolver';
import { requestContext } from '@infrastructure/http/context/RequestContext';

import { CORE_TYPES } from '@core/constants/types';
import { AsyncLocalStorageIdentifyProvider } from '@infrastructure/auth/AsyncLocalStorageIdentifyProvider';
import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';
import { UserActor } from '@core/application/identity/UserActor';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';
import { SessionRepositoryPort } from '@modules/auth/application/ports';
import { extractToken } from '@infrastructure/http/auth/extract-token';

/** export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}; */

// export const identityMiddleware =
// (resolver: ActorResolver) => async (req: Request, res: Response, next: NextFunction) => {
@injectable()
export class IdentityMiddleware {
  constructor(
    @inject(CORE_TYPES.ActorResolver) private resolver: ActorResolver,
    @inject(CORE_TYPES.ConfigService) private configService: ConfigServicePort,
    @inject(CORE_TYPES.IdentityProvider) private identityProvider: AsyncLocalStorageIdentifyProvider,
    @inject(AUTH_TYPES.SessionRepository) private sessionRepo: SessionRepositoryPort,
  ) {}

  /**
   * Здесь мы делаем «тихое» обновление времени активности в БД.
   * Важно: мы не меняем сам токен здесь, только дату lastActive в базе,
   * чтобы не перегружать клиента куками на каждый чих.
   * */
  public execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Если это запрос на обновление токена - не трогаем его
    // if (req.path.endsWith('/auth/refresh')) {
    //   return next();
    // }

    const store = requestContext.getStore();
    console.log('identityMiddleware >>>>> store (должен быть пустым контекстом)', store);
    if (!store) return next();
    // this.identityProvider.getCurrentActor();

    try {
      // 1. Определяем актора через резолвер
      const actor = await this.resolver.resolve(req);
      store.actor = actor;

      // console.log('identityMiddleware >>>>> resolver.resolve() -> actor', actor);
      console.log(
        `\x1b[1m \x1b[4m \x1b[33m[identityMiddleware]:  >>> RESOLVER result >> store.actor instanceof ${store.actor.constructor.name}\x1b[0m`,
      );

      if (store.actor instanceof UserActor) {
        // Ищем сессию, чтобы обновить время активности (Sliding Window)
        const refreshToken = req.cookies['refreshToken'];

        if (refreshToken) {
          const session = await this.sessionRepo.findByToken(refreshToken);

          if (session) {
            //
            const updateTimeThreshold = this.configService.get('session').update_time_threshold;
            console.log(
              '\x1b[1m \x1b[4m \x1b[33m[',
              Date.now(),
              ' - ',
              session.props.lastActiveAt.getTime(),
              ' = ',
              Date.now() - session.props.lastActiveAt.getTime() > updateTimeThreshold,
              ' > ',
              updateTimeThreshold,
              '\x1b[0m',
            );

            if (Date.now() - session.props.lastActiveAt.getTime() > updateTimeThreshold) {
              session.markAsActive();
              await this.sessionRepo.save(session);

              // 3. Обновляем куку в браузере (продлеваем срок жизни)
              // res.cookie('refreshToken', session.props.refreshToken, {
              //   httpOnly: true,
              //   maxAge: postponeMsData, // Продлеваем еще на неделю
              //   // path: '/api/auth/refresh',
              //   path: '/',
              //   secure: true,
              //   sameSite: 'lax',
              // });
            }
          }
        }
      }

      // 2. Если это гость, фиксируем его ID в куках, чтобы он "узнавался" в след. раз
      if (store.actor instanceof GuestActor) {
        this.extendGuestCookie(res, actor.id);
      }

      console.log('identityMiddleware >>>>> END END >>>>>>>>>>>>>>>>>>>>>>>>');
      next();
    } catch (error) {
      // Важно: здесь мы не прерываем выполнение, а просто оставляем actor: null
      // или Guest, если ошибка аутентификации не критична для всех роутов.
      // Но если токен протух — лучше отправить в errorHandler.
      next(error); // Ошибка улетает в errorHandler
    }
  };

  extendGuestCookie(res: Response, actorId: string): void {
    const guestIdLifetimeSec = this.configService.get('guest').guestIdLifetimeSec;
    const guestIdLifetime = new TokenLifetime(guestIdLifetimeSec);

    res.cookie('guestId', actorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: guestIdLifetime.getExpirationTimestamp(), //1000 * 60 * 60 * 24 * 365, // 365 days
    });
  }
}
