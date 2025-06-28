import { NextFunction, Response } from 'express';
import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { User, Word, WordTranslation } from '@core/domain/entities';
import { CreateWordDto, UpdateWordDto } from '@core/domain/entities/word/types/create-word.dto';
import { UserError, WordError } from '@core/domain/errors';
import {
  ISortDirection,
  IUserService,
  IValidationService,
  IWordService,
  TableCommonParamsRequest,
} from '@core/interfaces';
import { CustomRequest } from '@infrastructure/http/interfaces/custom-request.interface';

@injectable()
export class WordController {
  constructor(
    // @inject(DiTypes.UserService) private userService: IUserRepositoryService,
    @inject(DiTypes.UserService) private userService: IUserService,
    @inject(DiTypes.WordService) private wordService: IWordService,
    @inject(DiTypes.ValidationService) private validationService: IValidationService,
  ) {}

  /** TODO альтернативный способ загрузки через DI в контроллере??!!!!!!!
   * import { container } from '../../infrastructure/di/inversify.config';
   * import { TYPES } from '../../infrastructure/di/types';
   * import { WordService } from '../../application/services/WordService';
   *
   * const wordService = container.get<WordService>(DiTypes.WordService);
   * */

  async getAll(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log('getAll from WordController');

      const { filter, limit, offset, sortName, sortDirection } = req.query;
      const queryParams: TableCommonParamsRequest = {
        filter: filter ? filter?.toString() : '',
        limit: limit ? parseInt(limit.toString()) : 0,
        offset: offset ? parseInt(offset.toString()) : 0,
        sortName: sortName ? sortName.toString() : 'text',
        sortDirection: (sortDirection ? sortDirection.toString() : 'asc') as ISortDirection, // TODO ???
      };

      console.log(filter, limit, offset);
      console.log(typeof filter, typeof limit, typeof offset);
      console.log(queryParams);

      const user = req.user;
      if (!user) {
        throw UserError.NotFound();
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const userId = user.id!.toString();
      const words = await this.wordService.getAll(userId, queryParams);

      return res.status(200).json(words);
    } catch (e) {
      return next(e);
    }
  }

  /** get word by ID */
  async findWord(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { wordId } = req.params;
      // const { wordId } = req.query;
      const user = req.user;
      if (!user?.id || !wordId) {
        throw UserError.NotFound();
      }

      // const word = await this.wordRepository.findById(wordId);
      const word = await this.wordService.findById(wordId);
      // word.toObject();
      console.log('WordController findWord() word find = ', word);
      return res.status(200).json(word);
    } catch (e) {
      return next(e);
    }
  }

  //CREATE WORD TODO всю логику убрать в сервис
  async create(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.user?.id?.toString(); //: string | undefined
      console.log('WordController create() userId ', userId);
      if (!userId) {
        throw UserError.NotFound();
      }
      const user: User | null = await this.userService.findById(userId);
      if (!user) {
        throw UserError.NotFound();
      }

      const wordDto: CreateWordDto = req.body;

      const { wordId } = req.params;
      // TODO валидация входящих данных (соответствие полученных данных схемам zod)
      // const word = await this.wordService.findByValue(userId, data.text.trim());
      // // const wordDoc = await word-model.findOne({
      //   text: data.text.trim(),
      // });

      /** ЕСЛИ ЕСТЬ ТО не сохранять его заново, а предупредить пользователя что такое слово есть и
       *  предложить ему добавить переводы к существующему!!!! */

      // const wordValidatedData = this.validationService.validate<CreateWordDto>(wordDto, createWordSchema, 'word');
      console.log('проверка схемы созданиия - успешно');

      const wordRes: Word = await this.wordService.createWord(userId, wordDto);

      return res.status(201).json(wordRes);
    } catch (e) {
      return next(e);
    }
  }

  // TODO всю логику убрать в сервис
  async updateWord(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      console.log('WORD Controller - update');
      console.log('PARAMS', req.query, req.params);
      const wordId = req.params.id;

      const userId = req.user?.id?.toString(); //: string | undefined
      if (!userId) {
        throw UserError.NotFound();
      }

      const updates = req.body as UpdateWordDto; //: string | undefined
      console.log('wordId /', wordId, '/');
      console.log('получен id юзера - ', userId);
      console.log('updates - ', updates);

      // const updatedWord = this.wordRepository.updateWord(userId, updates);
      const updatedWord = await this.wordService.updateWord(userId, updates);
      return res.status(200).json(updatedWord);

      // const { id, text, translations } = updates;
      // if (!id) {
      //   throw WordError.NotFound(text);
      // }
      // // Проверяем, что основной объект существует
      // const wordDoc = await UserWordModel.findById(id);
      // const existingWordDoc = await UserWordModel.findById(id); //wordDoc ? wordDoc.toObject() : null;
      // // const existingWord = await this.wordService.findWord(userId, id.toString());
      // if (!existingWordDoc) {
      //   throw WordError.NotFound(text);
      // }
      // // 1. Обновляем основное слово
      // existingWordDoc.text = text;
      // // 2. Обрабатываем массив translations
      // const updatedTranslations = translations.map((translation) => {
      //   if (!translation.id) {
      //     return {
      //       ...translation,
      //       id: new Types.ObjectId(),
      //     };
      //   }
      //   return translation;
      // });
      // // Удаляем старые переводы, которые отсутствуют в новых
      // const newTranslationIds = updatedTranslations.map((t) => t.id?.toString());
      // existingWordDoc.translations = existingWordDoc.translations.filter((t) =>
      //   newTranslationIds.includes(t.id?.toString()),
      // );
      // // Обновляем или добавляем новые переводы
      // updatedTranslations.forEach((newTranslation) => {
      //   const index = existingWordDoc.translations.findIndex((t) => t.id?.toString() === newTranslation.id?.toString());
      //   if (index === -1) {
      //     existingWordDoc.translations.push(newTranslation);
      //   } else {
      //     existingWordDoc.translations[index] = {
      //       ...existingWordDoc.translations[index], //.toObject(),
      //       ...newTranslation,
      //     };
      //   }
      // });

      // // Сохраняем обновленный документ
      // const updatedWord = await existingWordDoc.save();
      // console.log(updatedWord);
      //
      // return res.status(200).json(existingWordDoc);
    } catch (e) {
      return next(e);
    }
  }

  // TODO всю логику убрать в сервис
  async checkWordExists(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      console.log('PARAMS query', req.query);
      const wordTextValue = (req.query.word as string).trim();
      const userId = req.user?.id?.toString(); //: string | undefined
      console.log('wordText Value/', wordTextValue, '/');
      if (!userId) {
        throw UserError.NotFound();
      }

      const word = await this.wordService.findByValue(userId, wordTextValue);
      console.log('WordController checkWordExists word', word);
      if (word) {
        // throw WordError.AlreadyExists<IWordErrorBodyAlreadyExists>(wordTextValue, {
        //   id: word && word.id ? word.id.toString() : "",
        // });
        return res.status(200).json({ id: word && word.id ? word.id.toString() : '' });
      }
      console.log(word);

      return res.status(200).json({ id: null }); //word ? word?.id.toString() : null }); //word ? null : word?.id?.toString()
    } catch (e) {
      return next(e);
    }
  }

  // TODO всю логику убрать в сервис
  async addTranslation(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { wordId } = req.params;
      console.log('wordId', wordId);
      const userId = req.user?.id?.toString(); //: string | undefined
      if (!userId) {
        throw UserError.NotFound();
      }

      const translationData = req.body.translation as WordTranslation;

      console.log('translationData', translationData);
      const word = await this.wordService.addTranslation(userId, wordId, translationData);
      console.log(word);
      return res.status(200).json(word);
    } catch (e) {
      return next(e);
    }
  }
}
