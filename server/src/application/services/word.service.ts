import { Types } from 'mongoose';
import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { GetWordsResponse, Word, WordTranslation } from '@core/domain/entities';
import { CreateWordDto, UpdateWordDto, WordUpdateOperationResult } from '@core/domain/entities/word/types/word.dto';
import { WordDbDto } from '@core/domain/entities/word/types/word-db.dto';
import { WordError } from '@core/domain/errors/word.error';
import { WordTranslationError } from '@core/domain/errors/word-translation.error';
import { IValidationService, IWordService, TableCommonParamsRequest } from '@core/interfaces';
import { IWordRepository } from '@core/repositories';
import { WordDbMapper } from '@application/mappers/word-db.mapper';

/** БИЗНЕС ЛОГИКА
 *  (Любые методы) */
@injectable()
export class WordService implements IWordService {
  constructor(
    @inject(DiTypes.WordRepository) private wordRepository: IWordRepository,
    @inject(DiTypes.ValidationService) private validationService: IValidationService,
  ) {}

  async getAll(userId: string, options: TableCommonParamsRequest): Promise<GetWordsResponse> {
    const res: GetWordsResponse = await this.wordRepository.getAllForUser(userId, options);
    return res;
  }

  async findById(wordId: string): Promise<Word> {
    console.log('findById word ID =====', wordId);

    const word: Word | null = await this.wordRepository.findById(wordId); //.lean().exec(); // as DocResponseWithId<Word>[];

    if (!word) {
      throw WordError.NotFound(wordId);
    }

    console.log('<<<<<', word, '>>>>>');

    return word;
  }

  async findByValue(userId: string, wordValue: string): Promise<Word | null> {
    /** const word = await word-model.findOne({ text: wordValue })
      .populate({
        path: "owner", // Связанное поле
        match: { _id: userId }, // Условие фильтрации
        select: "id", // Поля, которые нужно вернуть
      })
      .exec();
    const wordObject = word?.toObject(); */
    const wordObject = await this.wordRepository.findByValue(userId, wordValue);

    console.log('wordObject =======', wordObject ?? 'слова нет');
    if (wordObject) {
      console.log('wordObject id =======', wordObject?.id ?? 'id нет');
      console.log('wordObject owner =======', wordObject?.owner ?? 'owner нет');
    }
    console.log('--wordObject---', wordObject);
    return wordObject;
  }

  async addTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<WordTranslation> {
    //TODO validation initial data - WordTranslation
    const newTranslation: WordTranslation = {
      id: new Types.ObjectId().toString(),
      text: newTransl.text,
      language: newTransl.language,
      description: newTransl.description,
      lexicalCategory: newTransl.lexicalCategory,
      difficultyLevel: newTransl.difficultyLevel,
    };
    console.log('newTranslation ========', newTranslation);
    const word = await this.wordRepository.findById(wordId);
    if (!word) {
      throw WordError.NotFound();
    }

    if (word.translations.some((item) => item.text === newTranslation.text)) {
      throw WordTranslationError.AlreadyExists(newTranslation.text); //BadRequest('translation', 'Translation already exists!');
    }

    const wordTranslation = await this.wordRepository.createTranslation(userId, wordId, newTranslation);
    console.log('Business SERVICE from REPO', wordTranslation);
    if (!wordTranslation) {
      throw WordTranslationError.NotFound();
    }

    return wordTranslation;
  }

  async createWord(userId: string, wordDto: CreateWordDto): Promise<Word> {
    const word = await this.findByValue(userId, wordDto.text.trim());
    if (word) {
      console.log('wordDoc', word);
      console.log('ERRORRRR, id = ', word.id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      throw WordError.AlreadyExists<{ id: string }>(word.text, { id: word.id!.toString() });
    }
    console.log('WordService createWord() param wordDto', wordDto);
    // const wordDomain: Word = WordMapper.toDomainFromCreateFull(wordDto, userId);
    console.log('WordService createWord() toDomainFromCreateFull res', wordDto);
    const wordDbDto: WordDbDto = WordDbMapper.toCreateWordEntity(wordDto, userId);
    console.log('WordService createWord() toEntity res', wordDbDto);
    const newWordCreated = await this.wordRepository.createWord(wordDbDto); //.toObject(); //: DocResponseWithId<Word>
    console.log('WordService createWord() wordRepository.createWord ToClient', newWordCreated);
    console.log('Попытка сохранить удачная');

    return newWordCreated;
    // }
  }

  async updateWord(userId: string, updates: UpdateWordDto): Promise<WordUpdateOperationResult> {
    // на выходе должно быть базовые свойства слова и перевод в виде объекта???????
    // TODO type out!!!!!!!!!!!!!!!!!!!
    const { id: wordId, text, translations } = updates;
    if (!wordId) {
      throw WordError.NotFound(text);
    }

    // Проверяем, что основной объект существует
    const existingWord = await this.wordRepository.findById(wordId.toString());

    if (!existingWord) {
      throw WordError.NotFound(text);
    }
    //// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (existingWord.owner?.toString() !== userId) {
      throw WordError.AccessDenied('Update word error: incorrect user id.');
    }
    console.log('>>>>>>updateWord >>>>>');
    console.log('text', text);
    console.log('id', wordId);
    existingWord.text = text;
    console.log('<<<<<<<dg<<<<<<<<<<<<<<<<<');

    const baseOperated = await this.wordRepository.updateWordBaseInfo(userId, wordId, updates);
    const translationsOperated = await this.wordRepository.updateWordTranslations(userId, wordId, updates);

    console.log('CONSOLE RESULT ===', JSON.stringify({ ...baseOperated, ...translationsOperated }, null, 2));
    return { ...baseOperated, ...translationsOperated };

    // const createRequests: { id: number | string; promise: Promise<WordTranslation | null> }[] =
    //   translations.created.map((tr, index) => {
    //     return {
    //       id: index,
    //       promise: this.wordRepository.createTranslation(userId, wordId, tr),
    //     };
    //   });
    // const createdResults = await Promise.allSettled(createRequests.map((r) => r.promise));
    // const createRes = createdResults.map((res, i) => ({
    //   id: createRequests[i].id,
    //   status: res.status,
    //   reason: res.status === 'rejected' ? res.reason : null,
    //   value: res.status === 'fulfilled' ? res.value : null,
    // }));
    //
    // const updateRequests: { id: string; promise: Promise<WordTranslation | null> }[] = translations.updated.map(
    //   (tr) => {
    //     return {
    //       id: tr.id,
    //       promise: this.wordRepository.updateTranslation(userId, wordId, tr),
    //     };
    //   },
    // );
    // const updatedResults = await Promise.allSettled(updateRequests.map((r) => r.promise));
    // const updateRes = updatedResults.map((res, i) => ({
    //   id: updateRequests[i].id,
    //   status: res.status,
    //   reason: res.status === 'rejected' ? res.reason : null,
    //   value: res.status === 'fulfilled' ? res.value : null,
    // }));
    //
    // const deleteRequests: { id: string; promise: Promise<string | null> }[] = translations.deleted.map((tr) => {
    //   return {
    //     id: tr.id,
    //     promise: this.wordRepository.deleteTranslation(userId, wordId, tr),
    //   };
    // });
    // const deletedResults = await Promise.allSettled(deleteRequests.map((r) => r.promise));
    // const deleteRes = deletedResults.map((res, i) => ({
    //   id: deleteRequests[i].id,
    //   status: res.status,
    //   reason: res.status === 'rejected' ? res.reason : null,
    //   value: res.status === 'fulfilled' ? res.value : null,
    // }));
    //
    // return {
    //   id: existingWord.id,
    //   text: existingWord.text,
    //   language: existingWord.language,
    //   translations: {
    //     created: createRes,
    //     updated: updateRes,
    //     deleted: deleteRes,
    //     skipped: [],
    //   },
    // };
  }

  async deleteWord(userId: string, id: string): Promise<Word | null> {
    return this.wordRepository.deleteWord(userId, id);
  }
}

// const createSuccess: WordTranslation[] = [];
// const createFailed: { index: number; reason: any }[] = [];
// const notCreated: { index: number; reason: 'null' }[] = [];
// if (translations.created.length > 0) {
//   const translationsForCreatePromises = translations.created.map((translation) =>
//     this.wordRepository.createTranslation(userId, wordId, translation),
//   );
//   const createResults = await Promise.allSettled(translationsForCreatePromises);
//
//   for (const [index, result] of createResults.entries()) {
//     if (result.status === 'fulfilled') {
//       if (result.value) {
//         createSuccess.push(result.value);
//       } else {
//         notCreated.push({ index, reason: 'null' });
//       }
//       console.log('Create success', result.value);
//     } else {
//       createFailed.push({ reason: result.reason, index });
//       console.warn('Create error', result.reason);
//     }
//   }
// }
// const createRes: any = {
//   success: createSuccess,
//   unsuccess: notCreated,
//   failed: createFailed,
// };

// const updateSuccess: WordTranslation[] = [];
// const updateFailed: { index: number; reason: any }[] = [];
// const notUpdate: { index: number; reason: 'null' }[] = [];
// if (translations.updated.length > 0) {
//   const translationsForUpdatePromises = translations.updated.map((translData) =>
//     this.wordRepository.updateTranslation(userId, wordId, translData),
//   );
//   const updatedResults = await Promise.allSettled(translationsForUpdatePromises);
//
//   for (const [index, result] of updatedResults.entries()) {
//     if (result.status === 'fulfilled') {
//       if (result.value) {
//         updateSuccess.push(result.value);
//       } else {
//         notUpdate.push({ index, reason: 'null' });
//       }
//       console.log('Update success', result.value);
//     } else {
//       updateFailed.push({ reason: result.reason, index });
//       console.warn('Update error', result.reason);
//     }
//   }

// }
// const updateRes: any = {
//   success: updateSuccess,
//   unsuccess: notUpdate,
//   failed: updateFailed,
// };

// const deleteIds: string[] = [];
// const deleteFailed: { index: number; reason: any }[] = [];
// // const notDeleted: { index: number; reason: 'null' }[] = [];

// if (translations.deleted.length > 0) {
// const translationsForDeletePromises = translations.deleted.map((transl) =>
//   this.wordRepository.deleteTranslation(userId, wordId, transl),
// );
// for (const [index, result] of deletedResults.entries()) {
//   if (result.status === 'fulfilled' && result.value) {
//     if (result.value) {
//       deleteIds.push(result.value);
//     } else {
//       deleteFailed.push({ index, reason: 'null' });
//     }
//     console.log('Create success', result.value);
//   } else {
//     deleteFailed.push({ reason: result.reason, index });
//     console.warn('Create error', result.reason);
//   }
// }
// }
// const deleteRes: any = {
//   success: deleteIds,
//   // unsuccess: notDeleted,
//   failed: deleteFailed,
// };
