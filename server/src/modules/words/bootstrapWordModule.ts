import { Container } from 'inversify';

import { EventBus } from '@events/EventBus';
import { registerEventHandlersDI } from '@events/registerEventHandlersDI';

import { setupWordModule } from '@modules/words/infrastructure/di/words.container';
import { WordCreatedLogHandler } from '@modules/words/infrastructure/events/handlers';

import { CORE_TYPES } from '@core/constants/types';

export function bootstrapWordModule(container: Container): void {
  setupWordModule(container);

  // const useCases = container.get<WordUseCases>(WORDS_TYPES.WordUseCases);

  // -------------------------------
  // EventBus: подписка на события
  // -------------------------------
  const eventBus = container.get<EventBus>(CORE_TYPES.EventBus);
  registerEventHandlersDI(container, eventBus, [WordCreatedLogHandler]);

  // Контроллер и роутер
  // const controller = container.get<WordController>(WORDS_TYPES.WordController);
  // const router: Router = makeWordRouter(controller);
  console.log('Words Module activated');
  // Возвращаем объект для приложения
  //return container.get<Router>(WORDS_TYPES.WordsRouter);
}
