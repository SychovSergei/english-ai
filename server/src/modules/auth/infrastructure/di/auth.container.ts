import { Router } from 'express';
import { Container } from 'inversify';

import { TokenServicePort, TokenVerifierPort, UserRepositoryPort } from '@modules/auth/application/ports';
import { GuestRepositoryPort } from '@modules/auth/application/ports/GuestRepositoryPort';
import {
  IdentifyGuestUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RegisterUserUseCase,
} from '@modules/auth/application/use-cases';

import { JwtTokenService, JwtTokenVerifier } from '@modules/auth/infrastructure/adapters/security';
import { MongoGuestRepository } from '@modules/auth/infrastructure/db/mongo/persistence/MongoGuestRepository';
import { MongoSessionRepository } from '@modules/auth/infrastructure/db/mongo/persistence/MongoSessionRepository';
import { MongoUserRepository } from '@modules/auth/infrastructure/db/mongo/persistence/MongoUserRepository';
// import { MongoAuthRepository } from '@modules/auth/infrastructure/db/mongo/persistence/MongoAuthRepository';
import { AuthController, makeAuthRouter } from '@modules/auth/infrastructure/http';

import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

export function setupAuthModule(container: Container): void {
  // --- Repository ---
  // container.bind(AUTH_TYPES.AuthRepository).to(MongoAuthRepository).inSingletonScope();
  container.bind(AUTH_TYPES.SessionRepository).to(MongoSessionRepository).inSingletonScope();
  container.bind<UserRepositoryPort>(AUTH_TYPES.UserRepository).to(MongoUserRepository).inSingletonScope();
  container.bind<GuestRepositoryPort>(AUTH_TYPES.GuestRepository).to(MongoGuestRepository).inSingletonScope();

  // --- Services ---
  container.bind<TokenVerifierPort>(AUTH_TYPES.TokenVerifier).to(JwtTokenVerifier).inSingletonScope();
  container.bind<TokenServicePort>(AUTH_TYPES.TokenService).to(JwtTokenService).inSingletonScope();

  // --- Use Cases ---
  container.bind<IdentifyGuestUseCase>(AUTH_TYPES.IdentifyGuestUseCase).to(IdentifyGuestUseCase);
  container.bind<RegisterUserUseCase>(AUTH_TYPES.RegisterUserUseCase).to(RegisterUserUseCase);
  container.bind<LoginUseCase>(AUTH_TYPES.LoginUseCase).to(LoginUseCase);
  container.bind<LogoutUseCase>(AUTH_TYPES.LogoutUseCase).to(LogoutUseCase);
  container.bind<RefreshTokenUseCase>(AUTH_TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase);

  // --- Controller and Routers ---
  container.bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController);
  container
    .bind<Router>(AUTH_TYPES.AuthRouter)
    .toDynamicValue((ctx) => {
      const controller = ctx.container.get<AuthController>(AUTH_TYPES.AuthController);
      return makeAuthRouter(controller);
    })
    .inSingletonScope();

  // --- Event Handlers ---
}
