import { Router } from 'express';
const router = Router();

import { DiTypes } from '@shared/types';

import { ITokenService } from '@core/interfaces';
import { ITokenRepositoryService } from '@core/repositories';
import { container } from '@infrastructure/di';
import { authTokenMiddleware, sessionCheckMiddleware } from '@infrastructure/http/middleware';
import { authRouter, openAiRouter, settingsRouter, wordRouter, wordSetRouter } from '@infrastructure/http/routes';

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
