import { Request } from 'express';
import { inject, injectable } from 'inversify';

import { Actor } from '@core/domain/identity/Actor';

import { GuestActor } from '@core/application/identity/GuestActor';
import { UserActor } from '@core/application/identity/UserActor';
import { GuestLimits } from '@core/application/limits/GuestLimits';
import { SessionRepositoryPort, TokenVerifierPort, UserRepositoryPort } from '@modules/auth/application/ports';
import { IdentifyGuestUseCase } from '@modules/auth/application/use-cases/IdentifyGuestUseCase';
import { IdentifyGuestCommand } from '@modules/words/application/commands/IdentifyGuestCommand';

import { extractToken } from '@infrastructure/http/auth/extract-token';

import { AUTH_TYPES } from '@modules/auth/constants/auth.types';
import { AuthError } from '@modules/auth/domain/errors/AuthError';

@injectable()
export class ActorResolver {
  constructor(
    @inject(AUTH_TYPES.TokenVerifier) private tokenVerifier: TokenVerifierPort,
    @inject(AUTH_TYPES.IdentifyGuestUseCase) private identifyGuestUC: IdentifyGuestUseCase,
    @inject(AUTH_TYPES.SessionRepository) private sessionRepo: SessionRepositoryPort,
    @inject(AUTH_TYPES.UserRepository) private userRepo: UserRepositoryPort,
    // @inject(CORE_TYPES.IdGenerator) private idGenerator: IdGenerator,
  ) {}

  async resolve(req: Request): Promise<Actor> {
    // 1. Пробуем найти пользователя через токен
    const token = extractToken(req);
    const fingerprint = req.headers['x-fingerprint'] as string;

    console.log('ActorResolver >>>>> resolve -> token = ', token?.toString().slice(0, 10));

    // 1. Пытаемся по Access Token
    if (token) {
      try {
        const payload = this.tokenVerifier.verify(token); // TODO может заменить на JwtTokenService ????
        // console.log('ActorResolver >>> (UserActor) resolve -> token payload =', payload);

        // 2. Пытаемся по Refresh Token (из куки)
        const refreshToken = req.cookies['refreshToken'] as string;
        if (refreshToken) {
          const session = await this.sessionRepo.findByToken(refreshToken);

          // Проверяем: сессия есть, она активна и фингерпринт совпадает
          if (session && session.isActive() && session.props.fingerprint === fingerprint) {
            const user = await this.userRepo.findById(session.props.userId);
            if (user) {
              return new UserActor(session.props.userId, user.role, user.email.value, user.firstName);
            }
          }
        }

        // В идеале: сходить в кеш/бд и проверить, не забанен ли юзер
        return new UserActor(payload.userId, payload.role, 'need to add email', 'need to add name');
      } catch (error) {
        // Если токен протух (expired) или кривой (invalid)
        console.warn('ActorResolver: Invalid or expired token, fallback to Guest');
        console.warn('AccessToken expired, checking RefreshToken...');

        // Не падаем, идем дальше проверять Refresh Token
        // throw AuthError.Unauthorized('Invalid or expired token');

        // TODO удалить комментарий - Опционально: можно явно удалять протухший токен из заголовков,
        //  но лучше просто дать логике спуститься к определению Гостя.
      }
    }

    // 3. Если ничего не помогло — Гость
    return this.resolveGuest(req);
  }

  private async resolveGuest(req: Request): Promise<GuestActor> {
    // Сначала по куке, потом по фингерпринту
    console.log('\x1b[1m\x1b[36mЕсли нет токена ИЛИ он был невалидным — ищем гостя\x1b[0m');
    const guestIdFromCookie = req.cookies['guestId'];
    const fingerprint = req.headers['x-fingerprint'] as string;
    console.log('ActorResolver x-fingerprint =', fingerprint, 'guestIdFromCookie =', guestIdFromCookie);

    const identifyGuestCommand = IdentifyGuestCommand.create({ fingerprint, guestId: guestIdFromCookie, ip: req.ip });
    const guest = await this.identifyGuestUC.execute(identifyGuestCommand);

    // const guestId = req.cookies.guestId ?? req.headers['x-guest-id'] ?? this.idGenerator.generate();
    // console.log('ActorResolver >>>>> resolve -> guestId = ', guest);

    // console.log('ActorResolver >>> (GuestActor)');

    return new GuestActor(guest.id, GuestLimits.default());
  }
}
