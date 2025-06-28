import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

import { DiTypes } from '@shared/types';

import { container } from '@infrastructure/di/inversify.config';
import { WordController } from '@infrastructure/http/controllers';
import { CustomRequest } from '@infrastructure/http/interfaces/custom-request.interface';

const wordController = container.get<WordController>(DiTypes.WordController);

router.get('/', async (req: CustomRequest, res: Response, next: NextFunction) => {
  await wordController.getAll(req, res, next);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  await wordController.create(req, res, next);
});

router.get('/check-exists', async (req: Request, res: Response, next: NextFunction) => {
  console.log('check-exists WORD ROUTER');
  await wordController.checkWordExists(req, res, next);
});

router.get('/:wordId', async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { wordId } = req.params;
  console.log('-------------', wordId, '-----------------------');
  try {
    await wordController.findWord(req, res, next);
  } catch (e) {
    console.log(e);
  }
});

router.patch('/:id', async (req: CustomRequest, res: Response, next: NextFunction) => {
  await wordController.updateWord(req, res, next);
});

router.post('/:wordId/translations', async (req: CustomRequest, res: Response, next: NextFunction) => {
  await wordController.addTranslation(req, res, next); //TODO проверить нужно ли мне :id в URL
});

export const wordRouter = router;
