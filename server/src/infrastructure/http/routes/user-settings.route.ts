import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

import { DiTypes } from '@shared/types';

import { container } from '@infrastructure/di/inversify.config';
import { UserSettingsController } from '@infrastructure/http/controllers';

const userSettingsController = container.get<UserSettingsController>(DiTypes.UserSettingsController);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  await userSettingsController.getSettings(req, res, next);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  await userSettingsController.createSettings(req, res, next);
});

router.put('/', userSettingsController.updateSettings);

export const settingsRouter = router;
