import { Router } from 'express';
import { Container } from 'inversify';

import { UserRepositoryPort } from '@modules/users/application/ports';
import { GetUserProfileUseCase } from '@modules/users/application/use-cases/GetUserProfileUseCase';

import { MongoUserRepository } from '@modules/users/infrastructure/db/mongo/persistence/MongoUserRepository';
// import {
//   CheckWordExistsUseCasePort,
//   CreateWordUseCasePort,
//   GuestUsageRepositoryPort,
//   GuestWordLimitServicePort,
//   WordRepository,
// } from '@modules/words/application/ports';
// import { GuestWordLimitService } from '@modules/words/application/services/GuestWordLimitService';
// import {
//   CheckWordExistsUseCase,
//   CreateWordUseCase,
//   DeleteWordUseCase,
//   GetActorWordsUseCase,
//   UpdateWordUseCase,
// } from '@modules/words/application/use-cases';
import { UserUseCases } from '@modules/users/infrastructure/di/UserUseCases';
import { UserController } from '@modules/users/infrastructure/http/controllers/UserController';
import { makeUserRouter } from '@modules/users/infrastructure/http/user.routes';

// import { WordUseCases } from '@modules/words/infrastructure/di/WordUseCases';
// import { WordCreatedLogHandler } from '@modules/words/infrastructure/events/handlers';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';
// import { makeWordRouter, WordController } from '@modules/words/infrastructure/http';
// import { MongoGuestUsageRepository, MongoWordRepository } from '@modules/words/infrastructure/persistence';
import { USER_TYPES } from '@modules/users/constants/user.types';

export function setupUserModule(container: Container): void {
  // Repository
  container.bind<UserRepositoryPort>(AUTH_TYPES.UserRepository).to(MongoUserRepository).inSingletonScope();

  // Use Cases
  container.bind<UserUseCases>(USER_TYPES.UserUseCases).to(UserUseCases);
  container.bind<GetUserProfileUseCase>(USER_TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase);

  // Controllers and Routers
  container.bind<UserController>(USER_TYPES.UsersController).to(UserController).inSingletonScope();
  container
    .bind<Router>(USER_TYPES.UsersRouter)
    .toDynamicValue((ctx) => {
      const controller = ctx.container.get<UserController>(USER_TYPES.UsersController);
      return makeUserRouter(controller);
    })
    .inSingletonScope();

  // Event Handlers
  // container.bind(WordCreatedLogHandler).toSelf().inSingletonScope();
}
