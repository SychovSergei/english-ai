import { asyncHandler } from '@core/utils/asyncHandler';
import { Request, Response, Router } from 'express';

import { AuthController } from '@modules/auth/infrastructure/http';

export function makeAuthRouter(controller: AuthController): Router {
  const router = Router();

  // /api/ahtu / identify - guest;
  router.post(
    // '/identify-guest',
    '/init',
    asyncHandler((req: Request, res: Response) => controller.identifyActor(req, res)),
  );

  // router.post('/register', (req, res) => controller.register(req, res));
  router.post(
    '/register',
    asyncHandler((req: Request, res: Response) => controller.register(req, res)),
  );
  router.post(
    '/login',
    asyncHandler((req: Request, res: Response) => controller.login(req, res)),
  );
  router.post(
    '/logout',
    asyncHandler((req: Request, res: Response) => controller.logout(req, res)),
  );
  router.post(
    '/refresh',
    asyncHandler((req: Request, res: Response) => controller.refresh(req, res)),
  );

  return router;
}
