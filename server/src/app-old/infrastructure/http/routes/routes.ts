import { Router } from 'express';
const router = Router();

import { ITokenService } from 'app-old/core/interfaces';
import { ITokenRepositoryService } from 'app-old/core/repositories';
import { container } from 'app-old/infrastructure/di';
// eslint-disable-next-line boundaries/element-types
import { authTokenMiddleware } from 'app-old/infrastructure/http/middleware';
// eslint-disable-next-line boundaries/element-types
import { sessionCheckMiddleware } from 'app-old/infrastructure/http/middleware/session-check.middleware';
import {
  authRouter,
  openAiRouter,
  settingsRouter,
  wordRouter,
  wordSetRouter,
} from 'app-old/infrastructure/http/routes';

import { DiTypes } from '@ioc/di.types';

const tokenService: ITokenService = container.get(DiTypes.TokenService);
const sessionService: ITokenRepositoryService = container.get(DiTypes.TokenRepositoryService);

const authToken = authTokenMiddleware(tokenService);
const sessionCheck = sessionCheckMiddleware(sessionService);

router.use('/auth', authRouter);
router.use('/words', authToken, wordRouter); //, authMiddleware
router.use('/word-sets', authToken, sessionCheck, wordSetRouter); // authMiddleware
router.use('/open-ai', authToken, sessionCheck, openAiRouter); //authMiddleware
router.use('/user-settings', authToken, sessionCheck, settingsRouter); //authMiddleware

export const mainRouter = router;
