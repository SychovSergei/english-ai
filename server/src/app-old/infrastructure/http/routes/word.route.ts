import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

// import { DiTypes } from '@shared/types';

import { container } from 'app-old/infrastructure/di/inversify.config';
import { WordController } from 'app-old/infrastructure/http/controllers';
import { CustomRequest } from 'app-old/infrastructure/http/interfaces/custom-request.interface';
import { DiTypes } from '@ioc/di.types';

// TODO это старый роутер
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
    await wordController.getWord(req, res, next);
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

router.delete('/:wordId', async (req: CustomRequest, res: Response, next: NextFunction) => {
  await wordController.deleteWord(req, res, next);
});

export const wordRouter = router;
