import { Router } from 'express';
import { Container } from 'inversify';

import {
  CheckWordExistsUseCasePort,
  CreateWordUseCasePort,
  GuestUsageRepositoryPort,
  GuestWordLimitServicePort,
  WordRepository,
} from '@modules/words/application/ports';
import { GuestWordLimitService } from '@modules/words/application/services/GuestWordLimitService';
import {
  CheckWordExistsUseCase,
  CreateWordUseCase,
  DeleteWordUseCase,
  GetActorWordsUseCase,
  UpdateWordUseCase,
} from '@modules/words/application/use-cases';

import { WordUseCases } from '@modules/words/infrastructure/di/WordUseCases';
import { WordCreatedLogHandler } from '@modules/words/infrastructure/events/handlers';
import { makeWordRouter, WordController } from '@modules/words/infrastructure/http';
import { MongoGuestUsageRepository, MongoWordRepository } from '@modules/words/infrastructure/persistence';

import { WORDS_TYPES } from '@modules/words/constants/words.types';

export function setupWordModule(container: Container): void {
  // Repository
  container.bind<WordRepository>(WORDS_TYPES.WordRepository).to(MongoWordRepository).inSingletonScope();
  container
    .bind<GuestUsageRepositoryPort>(WORDS_TYPES.GuestUsageRepository)
    .to(MongoGuestUsageRepository)
    .inSingletonScope();

  // Services
  container
    .bind<GuestWordLimitServicePort>(WORDS_TYPES.GuestWordLimitService)
    .to(GuestWordLimitService)
    .inSingletonScope();

  // Use Cases
  container.bind<WordUseCases>(WORDS_TYPES.WordUseCases).to(WordUseCases);
  container.bind<GetActorWordsUseCase>(WORDS_TYPES.GetActorWordsUseCase).to(GetActorWordsUseCase);
  container.bind<CreateWordUseCasePort>(WORDS_TYPES.CreateWordUseCase).to(CreateWordUseCase);
  container.bind<CheckWordExistsUseCasePort>(WORDS_TYPES.CheckWordExistsUseCase).to(CheckWordExistsUseCase);
  container.bind<UpdateWordUseCase>(WORDS_TYPES.UpdateWordUseCase).to(UpdateWordUseCase);
  container.bind<DeleteWordUseCase>(WORDS_TYPES.DeleteWordUseCase).to(DeleteWordUseCase);

  // Controllers and Routers
  container.bind<WordController>(WORDS_TYPES.WordController).to(WordController).inSingletonScope();
  container
    .bind<Router>(WORDS_TYPES.WordsRouter)
    .toDynamicValue((ctx) => {
      const controller = ctx.container.get<WordController>(WORDS_TYPES.WordController);
      return makeWordRouter(controller);
    })
    .inSingletonScope();

  // Event Handlers
  container.bind(WordCreatedLogHandler).toSelf().inSingletonScope();
}
