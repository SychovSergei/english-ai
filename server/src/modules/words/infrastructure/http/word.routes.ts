import { asyncHandler } from '@core/utils/asyncHandler';
import { Request, Response, Router } from 'express';

import { WordController } from '@modules/words/infrastructure/http/controllers/WordController';

export function makeWordRouter(controller: WordController): Router {
  const router = Router();

  router.get(
    '/my-words',
    asyncHandler((req: Request, res: Response) => controller.getUserWords(req, res)),
  );
  router.get(
    '/',
    asyncHandler((req: Request, res: Response) => controller.getUserWords(req, res)),
  );
  router.post(
    '/check-exists',
    asyncHandler((req: Request, res: Response) => controller.checkWordExists(req, res)),
  );
  router.post(
    '/',
    asyncHandler((req: Request, res: Response) => controller.createWord(req, res)),
  );
  router.put(
    '/:wordId',
    asyncHandler((req: Request, res: Response) => controller.updateWord(req, res)),
  );
  router.delete(
    '/:id',
    asyncHandler((req: Request, res: Response) => controller.deleteWord(req, res)),
  );

  return router;
}
