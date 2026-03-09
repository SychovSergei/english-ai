import { bootstrapAuthModule } from '@modules/auth/bootstrapAuthModule';
import { bootstrapWordModule } from '@modules/words/bootstrapWordModule';
import { Express, Request, Response, Router } from 'express';
import { Container } from 'inversify';

import { ActorResolver } from '@infrastructure/auth/ActorResolver';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';
import { WORDS_TYPES } from '@modules/words/constants/words.types';

import { bindCommon } from '@ioc/bindings/common.bindings';
import { bindConfig } from '@ioc/bindings/config.bindings';
import { bindEventBus } from '@ioc/bindings/event-bus.bindings';

import { bootstrapDatabase } from './bootstrapDatabase';
import { createApp } from './createApp';

export async function bootstrapApplication(container: Container): Promise<Express> {
  // DB connection
  await bootstrapDatabase();

  bindConfig(container);
  bindEventBus(container);
  bindCommon(container);

  // Modules
  bootstrapAuthModule(container);
  bootstrapWordModule(container);
  // TODO: const trainingModule = bootstrapTrainingModule(eventBus);
  // TODO: const userModule = bootstrapUserModule(eventBus);

  const authRouter = container.get<Router>(AUTH_TYPES.AuthRouter);
  const wordsRouter = container.get<Router>(WORDS_TYPES.WordsRouter);
  // const actorResolver = container.get<ActorResolver>(CORE_TYPES.ActorResolver);

  const app = createApp(
    container,
    /*actorResolver,*/ (app: Express) => {
      app.use('/api/auth', authRouter);
      app.use('/api/words', wordsRouter);
      // TODO: app.use('/api/training', trainingModule.router);
      // TODO: app.use('/api/users', userModule.router);

      app.get('/', (req: Request, res: Response) => {
        res.send('Server is working!');
      });
    },
  );

  return app;
}
