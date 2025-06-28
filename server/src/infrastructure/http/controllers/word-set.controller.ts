import { NextFunction, Response } from 'express';
import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { CreateWordSetDto, UpdateWordSetDto } from '@core/domain/entities/word-set/types/create-word-set.dto';
import { UserError } from '@core/domain/errors';
import { IValidationService, IWordSetService } from '@core/interfaces';
import { createWordSetDtoSchema } from '@infrastructure/http/dtos';
import { CustomRequest } from '@infrastructure/http/interfaces/custom-request.interface';

@injectable()
export class WordSetController {
  constructor(
    @inject(DiTypes.WordSetService) private wordSetService: IWordSetService,
    @inject(DiTypes.ValidationService) private validationService: IValidationService,
  ) {}

  async createWordSet(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log('WORD SET Controller - createWordSet');
      const userId = req.user?.id?.toString(); //: string | undefined
      if (!userId) {
        throw UserError.NotFound();
      }

      // const dto: CreateWordSetDto = req.body as CreateWordSetDto;
      const dto = this.validationService.validate<CreateWordSetDto>(
        req.body,
        createWordSetDtoSchema,
        'WordSet creation',
      );

      const createdWordSet = await this.wordSetService.createWordSet(dto, userId);

      // // const wordValidatedData: IWordRequestDto = Validation.validate<CreateWordDto>(req.body, WordSchema, "Word");
      // // const wordValidatedData = Validation.validate<Word<string>>(req.body, WordSchema, "Word");
      // const data: CreateWordDto = req.body as CreateWordDto;
      // const { wordId } = req.params;
      // // TODO валидация входящих данных (соответствие полученных данных схемам zod)
      // const word = await this.wordService.findByValue(wordId, data.text.trim());
      // // const wordDoc = await word-model.findOne({
      // //   text: data.text.trim(),
      // // });
      //
      // /** ЕСЛИ ЕСТЬ ТО не сохранять его заново, а предупредить пользователя что такое слово есть и
      //  *  предложить ему добавить переводы к существующему!!!! */
      // if (word) {
      //   console.log('wordDoc', word);
      //   console.log('ERRORRRR, id = ', word.id);
      //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //   throw WordError.AlreadyExists<{ id: string }>(word.text, { id: word.id!.toString() });
      // }
      //
      // const wordValidatedData = this.validationService.validate<CreateWordDto>(data, createWordSchema, 'word');
      // console.log('проверка схемы созданиия - успешно');
      //
      // //TODO проверка юзера избыточна (если есть запрос то уже юзер должен быть)
      // const user: User | null = await this.userService.findById(userId);
      // if (!user) {
      //   throw UserError.NotFound();
      // }
      //
      // const newWordData: Word = {
      //   owner: userId,
      //   isPublic: false,
      //   createdAt: new Date(),
      //
      //   text: wordValidatedData.text,
      //   language: wordValidatedData.language,
      //   relatedForms: wordValidatedData.relatedForms,
      //   // difficultyLevel: wordValidatedData.difficultyLevel,
      //   translations: wordValidatedData.translations,
      //   sentences: wordValidatedData.sentences,
      // };
      //
      // console.log('процесс создания слова...');
      // // const word = await wordService.createNewWord(userId, newWordData);
      // // const wordRes: Word = await this.wordRepository.createWord(newWordData);
      // const wordRes: Word = await this.wordService.createWord(newWordData);
      // console.log('процесс создания слова... SUCCESS...', wordRes.text);

      // return res.status(201).json(wordRes);
      return res.status(201).json(createdWordSet);
    } catch (e) {
      return next(e);
    }
  }

  async updateWordSet(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      console.log('WORD Controller - update');
      console.log('PARAMS', req.query, req.params);
      const wordId = req.params.id;

      const userId = req.user?.id?.toString(); //: string | undefined
      if (!userId) {
        throw UserError.NotFound();
      }

      const updates = req.body as UpdateWordSetDto;

      console.log('wordId /', wordId, '/');
      console.log('получен id юзера - ', userId);
      console.log('updates - ', updates);
      const updatedWord = await this.wordSetService.updateWordSet(updates, userId);

      return res.status(200).json(updatedWord);
    } catch (e) {
      return next(e);
    }
  }

  async getAll(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log('WordSet Controller getAll()');
    } catch (e) {
      return next(e);
    }
  }
}
