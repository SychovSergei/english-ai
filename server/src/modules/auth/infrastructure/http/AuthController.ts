import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ActorRole } from '@core/domain/enums/user-roles.enum';
import { AuthError } from '@modules/auth/domain/errors';
import { TokenLifetime } from '@modules/auth/domain/value-objects';

import { GuestActor, UserActor } from '@core/application/identity';
import { ConfigServicePort } from '@core/application/ports';
import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';
import { LoginCommand } from '@modules/auth/application/commands/LoginCommand';
import { RefreshTokenCommand } from '@modules/auth/application/commands/RefreshTokenCommand';
import { TokenServicePort } from '@modules/auth/application/ports';
import {
  IdentifyGuestUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RegisterUserUseCase,
} from '@modules/auth/application/use-cases';
import { LoginDTO, LogoutDTO, RegisterUserDTO } from '@modules/auth/application/use-cases/dto';
import { AuthResponse } from '@modules/auth/application/use-cases/dto/LoginDTO';

import { MongoSessionRepository } from '@modules/auth/infrastructure/db/mongo/persistence/MongoSessionRepository';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

export interface AuthInitResponseDto {
  actor: {
    id: string;
    role: ActorRole; //'admin' | 'teacher' | 'student' | 'guest';
    email?: string; // только для авторизованного пользователя
    name?: string; // только для авторизованного пользователя
  };
  accessToken?: string;
  // Лимиты важны для логики "Гостя"
  limits?: {
    wordsLeft: number;
    trainingLeft: number;
    availableExercises: string[];
  };
  // Настройки пользователя (тема, язык интерфейса)
  settings?: {
    theme: string;
    uiLang: string;
  };
}

@injectable()
export class AuthController {
  constructor(
    @inject(CORE_TYPES.ConfigService) private configService: ConfigServicePort,
    @inject(CORE_TYPES.IdentityProvider) private identityProvider: IdentityProvider,

    @inject(AUTH_TYPES.IdentifyGuestUseCase) private identifyGuestUC: IdentifyGuestUseCase,

    @inject(AUTH_TYPES.LoginUseCase) private loginUC: LoginUseCase,
    @inject(AUTH_TYPES.LogoutUseCase) private logoutUC: LogoutUseCase,
    @inject(AUTH_TYPES.RegisterUserUseCase) private registerUC: RegisterUserUseCase,
    @inject(AUTH_TYPES.RefreshTokenUseCase) private refreshTokenUC: RefreshTokenUseCase,

    @inject(AUTH_TYPES.SessionRepository) private sessionRepo: MongoSessionRepository,
    @inject(AUTH_TYPES.TokenService) private tokenService: TokenServicePort,
  ) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  /** Запускается при обращении на путь /api/auth/init,
   *  при перезагрузке страницы на фронтенде
   */
  async identifyActor(req: Request, res: Response): Promise<void> {
    console.log(
      `\x1b[1m\x1b[4m\x1b[35m AuthController\x1b[0m ->` +
        `\x1b[1m\x1b[4m\x1b[31m identifyActor() \x1b[0m  >>>>> START START`,
    );

    // На самом деле, к моменту попадания сюда,
    // identityMiddleware уже выполнил resolve() и записал актора в store.

    const actor = this.identityProvider.getCurrentActor();
    const fingerprintt = req.headers['x-fingerprint'] as string;
    console.log('AuthController -> identifyActor() >>>>> actor >>>', actor);

    // Проверяем, есть ли активная сессия
    // if (!actor) {
    //   console.log('Actor не определен в Store. Пытаемся определить актора по фингерпринту');
    //
    //   const guestIdFromCookie = req.cookies['guestId'];
    //   console.log('AuthController -> identifyActor -> x-fingerprint =', fingerprint);
    //   console.log('AuthController -> identifyActor -> guestId From Cookie =', guestIdFromCookie);
    //
    //   const identifyGuestCommand = IdentifyGuestCommand.create({ fingerprint, guestId: guestIdFromCookie, ip: req.ip });
    //
    //   // Получаем текущего актора (логика внутри UC сама поймет,
    //   // есть ли активная сессия или нужно выдать гостя)
    //
    //   // TODO должен вернуть актора или гостя ?????
    //   // Возвращаем гостя (если его нет, то создаем в базе и возвращаем)
    //   // Создает гостя, если его нет, или возвращает существующего в базе
    //   const actor = await this.identifyGuestUC.execute(identifyGuestCommand);
    //
    //   console.log('AuthController ->>>>> identifyActor ->>>>>>>> actor ===', actor);
    // }

    // Подготавливаем базовый ответ
    const response: AuthInitResponseDto = {
      actor: { id: actor.id, role: actor.role },
    };

    if (actor instanceof UserActor) {
      // 1. Мы знаем, что юзер авторизован (токен в заголовке был валиден)
      // 2. Достаем текущую сессию из БД по userId и fingerprint
      const session = await this.sessionRepo.findByUserAndFingerprint(actor.id, fingerprintt);
      console.log('actor instanceof UserActor -> response', response);

      // TODO Здесь можно добавить логику продления токенов, если нужно

      if (session) {
        const newRToken = this.tokenService.generateRefreshToken();
        const newAToken = this.tokenService.generateAccessToken({
          userId: actor.id,
          role: actor.role,
        });

        const lifetime = new TokenLifetime(this.configService.get('jwt').refreshKeyExpiresInSec);
        const expiresAt = new Date(lifetime.getExpirationTimestamp());

        session.rotateToken(newRToken, expiresAt);
        await this.sessionRepo.save(session);

        console.log('refreshToken Cookie maxAge - ', lifetime.ms);
        res.cookie('refreshToken', newRToken, {
          httpOnly: true,
          maxAge: lifetime.ms,
          path: '/', // если указать пустым, то сам добавится как /api/auth
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        // 6. !!! Важно: Отправляем новый AccessToken в теле ответа,
        // чтобы фронтенд его обновил в памяти
        response.accessToken = newAToken;
        // Для авторизованного пользователя добавляем профиль
        response.actor.email = actor.email;
        response.actor.name = actor.name;
      }
    }

    if (actor instanceof GuestActor) {
      // Возвращаем данные гостя, если фронтенду нужно что-то знать (например, ID)
      /** response.actor = {
        id: actorFromStore.id,
        role: EGuestRole.GUEST,
      };*/
      // Для гостя устанавливаем лимиты и т.д.
      response.limits = {
        wordsLeft: actor.limits.wordsLeft, // TODO взять из GuestDefaultLimits
        trainingLeft: actor.limits.trainingLeft,
        availableExercises: ['cards', 'basic-sentences'],
      };

      // const guestIdLifetimeSec = this.configService.get('guest').guestIdLifetimeSec;
      // const guestIdLifetime = new TokenLifetime(guestIdLifetimeSec);
      //
      // // Устанавливаем/обновляем куку гостя, чтобы не терять его оффлайн-данные
      // res.cookie('guestId', actor.id, {
      //   httpOnly: true,
      //   maxAge: guestIdLifetime.getExpirationTimestamp(),
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'lax',
      // });
      // console.log('actor instanceof GuestActor -> response', response);
    }
    // console.log('AuthController -> identifyActor -> response', response);

    // TODO !!!!!!!! Если вдруг сюда зашел авторизованный юзер
    //  проверить логику - если пользователь авторизованный,
    //  тогда не надо отправлять id гостя в куках??? (тогда отправляются/обновляются токены???)
    // res.status(200).json({
    //   id: actor.id,
    //   message: 'Already authenticated',
    // });

    res.status(200).json(response);
  }

  async register(req: Request, res: Response): Promise<void> {
    const dto: RegisterUserDTO = req.body; //TODO verify by class-transformer or class-validator ???
    const result = await this.registerUC.execute(dto);

    res.status(201).json(result);
  }

  async login(req: Request, res: Response): Promise<void> {
    console.log(
      `\x1b[1m\x1b[4m\x1b[35m AuthController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m login() \x1b[0m  >>>>> START START`,
    );
    const dto: LoginDTO = req.body;
    console.log('LOGIN DTO', dto);
    const fingerprint = req.headers['x-fingerprint'] as string;
    const command = LoginCommand.create({
      email: dto.email,
      password: dto.password,
      ip: req.ip ?? '',
      userAgent: req.headers['user-agent'] ?? '',
      fingerprint,
    });

    const result = await this.loginUC.execute(command);

    const refreshTokenLifetimeSec = this.configService.get('jwt').refreshKeyExpiresInSec;
    const lifetime = new TokenLifetime(refreshTokenLifetimeSec);

    // 1. Кука (для рефреша)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // path: '/api/auth/refresh', // кука будет летать только на этот эндпоинт!
      path: '/',
      sameSite: 'lax',
      maxAge: lifetime.ms,
    });

    res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    } as AuthResponse);
  }

  async logout(req: Request, res: Response): Promise<void> {
    console.log(
      `\x1b[1m\x1b[4m\x1b[35m AuthController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m logout() \x1b[0m  >>>>> START START`,
    );
    // Logout обычно берет данные из сессии или заголовка
    // Достаем userId из актора (которого положил middleware)
    const actor = this.identityProvider.getCurrentActor();
    const refreshToken = req.cookies['refreshToken'];

    // TODO - Не DTO, а command !!!!
    const dto: LogoutDTO = { userId: actor.id, refreshToken };

    await this.logoutUC.execute(dto);

    // Очищаем куку на клиенте
    res.clearCookie('refreshToken').status(204).send();
  }

  async refresh(req: Request, res: Response): Promise<void> {
    console.log(
      `\x1b[1m\x1b[4m\x1b[35m AuthController\x1b[0m ->` + `\x1b[1m\x1b[4m\x1b[31m refresh() \x1b[0m  >>> START`,
    );

    const actor = this.identityProvider.getCurrentActor();
    console.log(
      `\x1b[1m\x1b[4m\x1b[35m AuthController\x1b[0m ->` +
        `-------\x1b[1m\x1b[4m\x1b[31m refresh() ${actor.role} \x1b[0m  >>> START`,
    );

    const oldRefreshToken = req.cookies['refreshToken'];
    const fingerprint = req.headers['x-fingerprint'] as string;

    if (!oldRefreshToken || !fingerprint) {
      throw AuthError.Unauthorized('Missing tokens');
    }

    const refreshCommand = RefreshTokenCommand.create({
      refreshToken: oldRefreshToken,
      fingerprint,
    });

    const result = await this.refreshTokenUC.execute(refreshCommand);

    const refreshTokenLifetimeSec = this.configService.get('jwt').refreshKeyExpiresInSec;
    const lifetime = new TokenLifetime(refreshTokenLifetimeSec);

    // Устанавливаем НОВЫЙ рефреш-токен в куки
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // path: '/api/auth/refresh', // кука будет летать только на этот эндпоинт!
      path: '/',
      sameSite: 'lax',
      maxAge: lifetime.ms,
    });

    // AccessToken отдаем в теле ответа, фронтенд сохранит его в памяти (JS variable)
    res.status(200).json({ accessToken: result.accessToken });
  }
}
