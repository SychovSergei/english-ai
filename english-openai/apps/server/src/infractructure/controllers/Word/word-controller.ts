import { NextFunction, Response } from "express";
import { CustomRequest } from "../../interfaces--/custom-request.interface";

import { Validation } from "../../services/validator";
import { CreateWordDTO, createWordSchema, UpdateWordDTO, Word } from "../../../core/entities/Word/word-schema";
import { UserError } from "../../../core/errors/user-error";
import { DocResponseWithId } from "../../interfaces--/mongo.interface";
import { User } from "../../db/entities/schemas/user-schema";
import WordModel from "../../db/entities/WordModel";
import { WordError } from "../../../core/errors/WordError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../../core/repositories/UserRepository/UserRepository";
import { IWordRepository } from "../../../core/repositories/WordRepository/WordRepository";

@injectable()
export class WordController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserRepository,
    @inject(TYPES.WordService) private wordService: IWordRepository,
  ) {}

  async getAll(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = req.user;
      if (!user) {
        throw UserError.NotFound();
      }

      const words = await this.wordService.getAll(user.id!.toString());

      return res.status(200).json(words);
    } catch (e) {
      return next(e);
    }
  }

  async findWord(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { wordId } = req.params;
      // const { wordId } = req.query;
      const user = req.user;
      if (!user?.id || !wordId) {
        throw UserError.NotFound();
      }

      const word = await this.wordService.findById(wordId);
      console.log("word find = ", word);
      return res.status(200).json(word);
    } catch (e) {
      return next(e);
    }
  }

  async create(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log("WORD Controller - create");
      // const wordValidatedData: IWordRequestDto = Validation.validate<CreateWordDTO>(req.body, WordSchema, "Word");
      // const wordValidatedData = Validation.validate<IWord<string>>(req.body, WordSchema, "Word");
      const data: CreateWordDTO = req.body as CreateWordDTO;
      const wordDoc = await WordModel.findOne({
        text: data.text.trim(),
      });

      /** ЕСЛИ ЕСТЬ ТО не сохранять его заново, а предупредить пользователя что такое слово есть и
       *  предложить ему добавить переводы к существующему!!!! */
      if (wordDoc) {
        console.log("wordDoc", wordDoc.toObject());
        console.log("ERRORRRR, id = ", wordDoc.toObject().id);
        throw WordError.AlreadyExists<{ id: string }>(wordDoc.text, { id: wordDoc.toObject().id!.toString() });
      }

      console.log("запрос на добавление слова1", req.body);
      console.log("запрос на добавление слова2");
      // const createWordObject: CreateWordDTO = {
      //   text: data.text,
      //   language: data.language,
      //   relatedForms: data.relatedForms,
      //   sentences: data.sentences,
      //   difficultyLevel: data.difficultyLevel,
      //   translations: data.translations.map((item) => ({
      //     text: item.text,
      //     language: item.language,
      //     description: item.description,
      //   })),
      // };
      const wordValidatedData = Validation.validate<CreateWordDTO>(data, createWordSchema, "word");
      console.log("проверка схемы созданиия - успешно");

      const userId = req.user?.id?.toString(); //: string | undefined
      console.log("получен id юзера - ", userId);
      if (!userId) {
        throw UserError.NotFound();
      }

      //TODO проверка юзера избыточна (если есть запрос то уже юзер должен быть)
      const user: DocResponseWithId<User> | null = await this.userService.findById(userId);
      if (!user) {
        throw UserError.NotFound();
      }

      const newWordData: Word = {
        owner: userId,
        isPublic: false,
        createdAt: new Date(),

        text: wordValidatedData.text,
        language: wordValidatedData.language,
        relatedForms: wordValidatedData.relatedForms,
        // difficultyLevel: wordValidatedData.difficultyLevel,
        translations: wordValidatedData.translations,
        sentences: wordValidatedData.sentences,
      };

      console.log("процесс создания слова...");
      // const word = await wordService.createNewWord(userId, newWordData);
      const word = await this.wordService.createNewWord(newWordData);
      console.log("процесс создания слова... SUCCESS...", word.text);

      return res.status(201).json({ word: word });
    } catch (e) {
      return next(e);
    }
  }

  async updateWord(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      console.log("WORD Controller - update");
      console.log("PARAMS", req.query, req.params);
      const wordId = req.params.id;

      const userId = req.user?.id?.toString(); //: string | undefined
      if (!userId) {
        throw UserError.NotFound();
      }

      const updates = req.body as UpdateWordDTO; //: string | undefined
      console.log("wordId /", wordId, "/");
      console.log("получен id юзера - ", userId);
      console.log("updates - ", updates);

      const updatedWord = this.wordService.updateWord(userId, updates);
      return res.status(200).json(updatedWord);

      // const { id, text, translations } = updates;
      // if (!id) {
      //   throw WordError.NotFound(text);
      // }
      // // Проверяем, что основной объект существует
      // const wordDoc = await WordModel.findById(id);
      // const existingWordDoc = await WordModel.findById(id); //wordDoc ? wordDoc.toObject() : null;
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

  async checkWordExists(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      console.log("PARAMS query", req.query);
      const wordTextValue = (req.query.word as string).trim();
      const userId = req.user?.id?.toString(); //: string | undefined
      console.log("wordText Value/", wordTextValue, "/");
      if (!userId) {
        throw UserError.NotFound();
      }

      const word = await this.wordService.findByValue(userId, wordTextValue);
      if (word) {
        throw WordError.AlreadyExists<{ id: string | null }>(wordTextValue, {
          id: word && word.id ? word.id.toString() : null,
        });
      }
      console.log(word);

      return res.status(200).json({ id: null }); //word ? word?.id.toString() : null }); //word ? null : word?.id?.toString()
    } catch (e) {
      return next(e);
    }
  }

  async addTranslation(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const wordId = req.params.id;
      console.log("wordId", wordId);
      const translationData = req.body.translation;
      console.log("translationData", translationData);
      const ddd = await this.wordService.addNewTranslation(wordId, translationData);
      console.log(ddd);
      return res.status(200).json(ddd);
    } catch (e) {
      return next(e);
    }
  }
}
