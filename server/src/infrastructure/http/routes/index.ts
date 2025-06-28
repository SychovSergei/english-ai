import { Router } from 'express';
const router = Router();

import { authMiddleware } from '@infrastructure/http/middleware/auth.middleware';
import { authRouter } from '@infrastructure/http/routes/auth.route';
import { openAiRouter } from '@infrastructure/http/routes/open-ai.route';
import { settingsRouter } from '@infrastructure/http/routes/user-settings.route';
import { wordRouter } from '@infrastructure/http/routes/word.route';
import { wordSetRouter } from '@infrastructure/http/routes/word-set.route';

router.use('/auth', authRouter);
router.use('/words', authMiddleware, wordRouter);
router.use('/word-sets', authMiddleware, wordSetRouter);
router.use('/open-ai', authMiddleware, openAiRouter);
router.use('/user-settings', authMiddleware, settingsRouter);

export const mainRouter = router;
