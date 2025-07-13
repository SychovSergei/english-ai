import { Types } from 'mongoose';
import { injectable } from 'inversify';

import { WordSet } from '@core/domain/entities';
import { UpdateWordDto } from '@core/domain/entities/word/types/word.dto';
import { WordSetDbDto } from '@core/domain/entities/word-set/types/word-set-db.dto';
import { WordError } from '@core/domain/errors';
import { IWordSetRepository } from '@core/repositories';
import { WordSetMapper } from '@application/mappers/word-set.mapper';
import { WordSetModel } from '@infrastructure/db/entities';

// НЕПОСРЕДСТВЕННО С БАЗОЙ ОПЕРАЦИИ
/** операции, связанные с хранением и извлечением данных */
@injectable()
export class WordSetRepositoryService implements IWordSetRepository {
  async createWordSet(newWordDbDto: WordSetDbDto): Promise<WordSet> {
    console.log('>> createWordSet WordSetRepositoryService');
    const newWordSet = await WordSetModel.create(newWordDbDto);
    //newWord.relatedForms; //translations[0].description;
    return WordSetMapper.fromEntityToDomain(newWordSet.toObject()); // Убирает Mongoose-методы, оставляет только данные
  }

  /** use */
  // async findByUserId(userId: string): Promise<Word[] | null> {
  //   return word-model.find({ owner: userId }); //.lean();
  // }

  //// eslint-disable-next-line  @typescript-eslint/no-unused-vars
  async updateWordSet(userId: string, wordData: UpdateWordDto): Promise<WordSet> {
    console.log('>> updateWord WordApi typeof updates.id =', typeof wordData.id);
    console.log('>> updateWord WordApi', userId, wordData);
    // const ddd = await word-model.findOne({ owner: new Types.ObjectId(userId), _id: updateWord.id });
    // console.log("ddd", ddd);

    // Массив для всех полей, которые нужно обновить
    const updateFields: Record<string, any> = {
      text: wordData.text,
    };

    // Дефолтные ключи для перевода
    // const translationFields: (keyof WordTranslation)[] = [
    //   'text',
    //   'language',
    //   'description',
    //   'difficultyLevel',
    //   'lexicalCategory',
    // ];

    // const wordFromDb = await word-model.findOne({ owner: new Types.ObjectId(userId), _id: wordData.id });
    // const wordFromDbObj = wordFromDb ? wordFromDb.toObject() : null;
    // const oldTranslationIds: string[] = [];
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    // console.log(wordFromDbObj);
    // if (wordFromDbObj) {
    //   console.log("wordFromDbObj");
    //   const ddd = wordFromDbObj.translations.map((translation) => translation.id);
    //   ddd.forEach((item) => {
    //     if (item) oldTranslationIds.push(item.toString());
    //   });
    // }
    // const newTranslationIds: string[] = wordData.translations.map((translation) => {
    //   return translation.id!.toString();
    // });
    // const newTranslationIdsSet: Set<string> = new Set(newTranslationIds);
    // const idsForDelete = oldTranslationIds.filter((currId) => !newTranslationIdsSet.has(currId));
    // console.log(oldTranslationIds);
    // console.log(newTranslationIds);
    // console.log("idsForDelete", idsForDelete);
    // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

    // Проходим по всем переводам и полям
    // wordData.translations.forEach((translation, index) => {
    //   if (!translation.id) {
    //     translation._id = new Types.ObjectId();
    //   }
    //
    //   translationFields.forEach((field) => {
    //     const key = `translations.${index}.${field}`; // Формируем ключ с индексом
    //     updateFields[key] = translation[field]; // Добавляем значение
    //   });
    //
    //   updateFields[`translations.${index}._id`] = translation._id;
    // });

    console.log('new data = ', updateFields);

    const updatedWord = await WordSetModel.findOneAndUpdate(
      { owner: new Types.ObjectId(userId), _id: wordData.id },
      {
        $set: {
          text: wordData.text,
          /* translations: wordData.translations.map((t) => {
            const { id, ...rest } = {
              _id: t.id || new Types.ObjectId(),
              ...t,
            };
            return rest;
          }),*/
        },
      },
      { new: true }, // return updated document
    );

    if (!updatedWord) throw WordError.NotFound(wordData.text);
    console.log('updatedWord', updatedWord?.toObject());
    return WordSetMapper.fromEntityToDomain(updatedWord.toObject()); //replaceWordTranslationIds(updatedWord);
  }
}

// function replaceWordTranslationIds(word: Word): Word {
//   word.translations = word.translations.map((translation) => {
//     translation.id = translation._id?.toString();
//     return translation;
//   });
//   return word;
// }

// Функция для экранирования специальных символов в RegExp
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
