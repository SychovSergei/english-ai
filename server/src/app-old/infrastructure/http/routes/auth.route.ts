import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

// import { TYPES } from '@shared/types';

import { DiTypes } from '@shared/types';

import { container } from '@infrastructure/di';

import { AuthController } from '../controllers/auth.controller';

const authController = container.get<AuthController>(DiTypes.AuthController);

router.post('/registration', async (req: Request, res: Response, next: NextFunction) => {
  await authController.registration(req, res, next);
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  await authController.login(req, res, next);
});

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  await authController.logout(req, res, next);
});

router.get('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  await authController.refresh(req, res, next);
});

export const authRouter = router;
