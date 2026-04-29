import { asyncHandler } from '@core/utils/asyncHandler';
import { Request, Response, Router } from 'express';

import { UserController } from '@modules/users/infrastructure/http/controllers/UserController';

export function makeUserRouter(controller: UserController): Router {
  const router = Router();

  router.get(
    '/profile',
    asyncHandler((req: Request, res: Response) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>> router USER');
      return controller.getProfile(req, res);
    }),
  );

  return router;
}
