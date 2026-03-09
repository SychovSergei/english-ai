import { inject, injectable } from 'inversify';

import { AuthError } from '@modules/auth/domain/errors/AuthError';
import { TokenLifetime } from '@modules/auth/domain/value-objects/TokenLifetime';

import { ConfigServicePort } from '@core/application/ports';
import { RefreshTokenCommand } from '@modules/auth/application/commands/RefreshTokenCommand';
import { SessionRepositoryPort, TokenServicePort, UserRepositoryPort } from '@modules/auth/application/ports';
import { AuthResult } from '@modules/auth/application/use-cases/dto';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(CORE_TYPES.ConfigService) private configService: ConfigServicePort,

    @inject(AUTH_TYPES.SessionRepository) private sessionRepo: SessionRepositoryPort,
    @inject(AUTH_TYPES.UserRepository) private userRepo: UserRepositoryPort,
    @inject(AUTH_TYPES.TokenService) private tokenService: TokenServicePort,
  ) {}

  async execute(cmd: RefreshTokenCommand): Promise<AuthResult> {
    const session = await this.sessionRepo.findByToken(cmd.refreshToken);

    if (!session || session.isExpired()) {
      // if (session) await this.sessionRepo.deleteByToken(dto.refreshToken);
      throw AuthError.Unauthorized('Session expired. Please login again.');
    }

    //Security
    if (session.props.fingerprint !== cmd.fingerprint) {
      await this.sessionRepo.delete(session.id); // Подозрение на взлом — удаляем сессию
      throw AuthError.Forbidden('Security breach detected. Please login again.');
    }

    const user = await this.userRepo.findById(session.props.userId);
    if (!user) {
      throw AuthError.Unauthorized('Invalid credentials');
    }
    // if (!user) {
    //   await this.sessionRepo.deleteByToken(dto.refreshToken);
    //   throw AuthError.Unauthorized('User no longer exists.');
    // }

    const newAccessToken = this.tokenService.generateAccessToken({
      userId: session.props.userId,
      role: user.role,
    });

    // Ротация: старый токен удаляем/меняем на новый
    const newRefreshToken = this.tokenService.generateRefreshToken();
    const newExpiryDate = new Date(
      new TokenLifetime(this.configService.get('jwt').refreshKeyExpiresInSec).getExpirationTimestamp(),
    );

    session.rotateToken(newRefreshToken, newExpiryDate);

    await this.sessionRepo.save(session);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { role: user.role, email: user.email.value, id: user.id.value },
    };
  }
}
