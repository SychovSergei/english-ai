import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

import { DiTypes } from '@shared/types';

import { container } from '@infrastructure/di/inversify.config';
import { WordSetController } from '@infrastructure/http/controllers';
import { CustomRequest } from '@infrastructure/http/interfaces/custom-request.interface';

const wordSetController = container.get<WordSetController>(DiTypes.WordSetController);

router.get('/', async (req: CustomRequest, res: Response, next: NextFunction) => {
  await wordSetController.getAll(req, res, next);
});

router.post('/', async (req: CustomRequest, res: Response, next: NextFunction) => {
  await wordSetController.createWordSet(req, res, next);
});

router.put('/', async (req: CustomRequest, res: Response, next: NextFunction) => {
  await wordSetController.updateWordSet(req, res, next);
});

// router.get('/check-exists', async (req: Request, res: Response, next: NextFunction) => {
//   await wordSetController.checkWordExists(req, res, next);
// });
//
// router.get('/:wordId', async (req: CustomRequest, res: Response, next: NextFunction) => {
//   const { wordId } = req.params;
//   console.log('-------------', wordId, '-----------------------');
//   try {
//     await wordSetController.findWord(req, res, next);
//   } catch (e) {
//     console.log(e);
//   }
// });
//
// router.patch('/:id', async (req: CustomRequest, res: Response, next: NextFunction) => {
//   await wordSetController.updateWord(req, res, next);
// });
//
// router.post('/:wordId/translations', async (req: CustomRequest, res: Response, next: NextFunction) => {
//   await wordSetController.addTranslation(req, res, next); //TODO проверить нужно ли мне :id в URL
// });

export const wordSetRouter = router;
