import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { Session, User } from '@modules/auth/domain/entities';
import { AuthError } from '@modules/auth/domain/errors/AuthError';
import { TokenLifetime } from '@modules/auth/domain/value-objects/TokenLifetime';

import { ConfigServicePort, IdGenerator } from '@core/application/ports';
import { PasswordHasher } from '@core/application/ports/auth/PasswordHasher';
import { BaseUseCase } from '@core/application/use-cases/BaseUseCase';
import { LoginCommand } from '@modules/auth/application/commands/LoginCommand';
import { SessionRepositoryPort, TokenServicePort, UserRepositoryPort } from '@modules/auth/application/ports';
import { AuthResult } from '@modules/auth/application/use-cases/dto';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

@injectable()
export class LoginUseCase extends BaseUseCase<LoginCommand, AuthResult> {
  constructor(
    @inject(CORE_TYPES.ConfigService)
    private configService: ConfigServicePort,

    @inject(CORE_TYPES.EventBus)
    private eventBus: EventBus,

    @inject(CORE_TYPES.PasswordHasher)
    private passwordHasher: PasswordHasher,

    @inject(AUTH_TYPES.UserRepository)
    private userRepo: UserRepositoryPort,

    @inject(AUTH_TYPES.TokenService)
    private tokenService: TokenServicePort,

    @inject(AUTH_TYPES.SessionRepository)
    private sessionRepo: SessionRepositoryPort,

    @inject(CORE_TYPES.IdGenerator) private idGenerator: IdGenerator,
  ) {
    super();
  }

  // TODO что возвращает юзкейс? dto?????
  async execute(cmd: LoginCommand): Promise<AuthResult> {
    // 1. Поиск пользователя
    const user = await this.userRepo.findByEmail(cmd.email);
    console.log('user', user);
    if (!user) {
      throw AuthError.Unauthorized('Invalid credentials');
    }

    // 2. Проверка пароля через hasher.compare
    const isPasswordCorrect: boolean = await this.passwordHasher.compare(cmd.password, user.password.value);
    console.log('isPasswordCorrect', isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw AuthError.Unauthorized('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.createOrUpdateSession(user, cmd);

    // TODO сделать публикацию события при логине ???
    //await this.eventBus.publishMany(word.pullDomainEvents());

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id.value,
        email: user.email.value,
        role: user.role,
      },
    };
  }

  private async createOrUpdateSession(
    user: User,
    cmd: LoginCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // const fingerprint = cmd.fingerprint;
    // Ищем существующую сессию для этого конкретного устройства
    const existingSession = await this.sessionRepo.findByUserAndFingerprint(user.id.value, cmd.fingerprint);
    console.log('existingSession:', existingSession);
    // 3. Генерация токенов
    const accessToken = this.tokenService.generateAccessToken({ userId: user.id.value, role: user.role });
    const refreshToken = this.tokenService.generateRefreshToken();

    const expirationDate = new TokenLifetime(
      this.configService.get('jwt').refreshKeyExpiresInSec,
    ).getExpirationTimestamp();
    const expiresAt = new Date(expirationDate);

    console.log('Session expirationDate', expirationDate);
    console.log('Session expiresAt', expiresAt);

    if (existingSession) {
      // Устройство знакомое, просто обновляем токен
      existingSession.rotateToken(refreshToken, expiresAt);
      await this.sessionRepo.save(existingSession);
    } else {
      // Новое устройство, сохраняем сессию
      const newSession = new Session(this.idGenerator.generate(), {
        userId: user.id.value,
        fingerprint: cmd.fingerprint,
        refreshToken,
        expiresAt,
        ip: cmd.ip,
        userAgent: cmd.userAgent,
        lastActiveAt: new Date(),
      });
      await this.sessionRepo.save(newSession);
    }
    return {
      accessToken,
      refreshToken,
    };
  }
}
