import { Types } from 'mongoose';
import { injectable } from 'inversify';

import { GetWordsResponse, Word, WordTranslation } from '@core/domain/entities';
import { WordDbDto } from '@core/domain/entities/word';
import { UpdateWordDto } from '@core/domain/entities/word/types/create-word.dto';
import { WordError } from '@core/domain/errors';
import { TableCommonParamsRequest } from '@core/interfaces';
import { IWordRepository } from '@core/repositories';
import { WordModel } from '@infrastructure/db/entities';
import { WordMapper } from '@application/mappers/word.mapper';

// interface WordSearchQuery {
//   owner: string; // Или ObjectId, если используется в Mongoose
//   text?: { $regex: string; $options: string }; // Для фильтрации по тексту
// }

// НЕПОСРЕДСТВЕННО С БАЗОЙ ОПЕРАЦИИ
/** операции, связанные с хранением и извлечением данных */
@injectable()
export class WordRepositoryService implements IWordRepository {
  async findByValue(userId: string, wordValue: string): Promise<Word | null> {
    const word = await WordModel.findOne({ owner: userId, text: wordValue }); //.lean().exec();
    // const res = word ? word.toObject() : null;
    console.log('>> WordApi Impl findByValue()', word);
    return word ? WordMapper.fromEntityToDomain(word) : word; // lean().exec();
  }

  async findById(wordId: string): Promise<Word | null> {
    const wordResult = await WordModel.findById(wordId); //.lean()
    const res = wordResult ? wordResult.toObject() : null;
    console.log('>> WordApi Impl findById()', res);
    return res ? WordMapper.fromEntityToDomain(res) : res;
  }

  async getAllForUser(userId: string, options: TableCommonParamsRequest): Promise<GetWordsResponse> {
    console.log('getAll from WordApi');
    // Получаем данные с учетом пагинации
    // const dbResponse = await word-model.find(searchQuery).skip(offset).limit(limit).lean().exec();
    // Получаем общее количество документов для конкретного пользователя (с учетом фильтра)
    // const total = await word-model.countDocuments({ owner: userId }); // Фильтрация по owner и text

    const userIdMongo = new Types.ObjectId(userId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchQuery: any = { owner: userIdMongo };
    const { filter, limit, offset, sortName = 'text', sortDirection = 'asc' } = options;

    // const sortDir = sortDirection === "asc" ? 1 : sortDirection === "desc" ? -1 : 0;

    const words = filter
      .trim()
      .split(/\s+/)
      .map((word) => escapeRegex(word));
    const regexFilter = words.length ? { text: { $regex: words.join('|'), $options: 'i' } } : {};

    console.log('WORDS (length):', words.length);
    // if filter exists and is not empty
    if (filter && filter.trim()) {
      const words = filter
        .trim()
        .split(/\s+/)
        .map((word) => escapeRegex(word)); // Экранируем специальные символы в словах фильтра
      // Создаём регулярное выражение для поиска каждого слова как подстроки
      const regexPattern = words.map((word) => `.*${word}.*`).join('|');
      // Добавляем фильтрацию по тексту
      searchQuery.text = { $regex: regexPattern, $options: 'i' };
    }

    // const result = await word-model.aggregate([
    //   {
    //     $match: { owner: userIdMongo, ...regexFilter },
    //   },
    //   {
    //     $facet: {
    //       total: [{ $count: "count" }], // Получаем общее количество документов
    //       data: [{ $match: searchQuery }, { $skip: offset }, { $limit: limit }], // Получаем пагинированные данные
    //     },
    //   },
    // ]).exec();

    const totalCount = await WordModel.countDocuments({
      owner: userIdMongo,
      ...regexFilter,
    });

    const sortOrder = sortDirection === 'asc' ? 1 : -1;
    const data = await WordModel.find({ owner: userIdMongo, ...regexFilter, ...searchQuery })
      .sort({ [sortName]: sortOrder }) // as SortOrder
      .skip(offset)
      .limit(limit);

    const dataToObject = data.map((wordDoc) => WordMapper.fromEntityToDomain(wordDoc.toObject()));
    // const formattedData: Word[] = dataToObject.map((word: Word) => {
    //   return {
    //     ...word,
    //     translations: word.translations.map((translation: WordTranslation) => ({
    //       ...translation,
    //       id: translation._id || translation.id,
    //     })),
    //   };
    // });

    // Возвращаем результат
    // console.log("*****", JSON.stringify(dataToObject, null, 2));
    return {
      total: totalCount,
      data: dataToObject,
    };

    // Get data and total amount
    // const dbResponse = result[0]?.data || [];
    // console.log("******", dbResponse);
    // const total = result[0]?.total[0]?.count || 0;
    //
    // console.log(result[0]?.data);
    // console.log(result[0]?.total[0]?.count);
    //
    // return {
    //   data: dbResponse,
    //   total: total,
    // };
  }

  async addTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<Word | null> {
    const updatedWord = await WordModel.findOneAndUpdate(
      { owner: new Types.ObjectId(userId), _id: wordId },
      {
        $push: { translations: { $each: [newTransl], $position: 0 } }, // Добавляем в начало или надо просто newTransl
      },
      // { $addToSet: { translations: newTranslation } },
      { new: true },
    );

    if (!updatedWord) throw WordError.NotFound(wordId);

    return updatedWord ? WordMapper.fromEntityToDomain(updatedWord) : updatedWord;
  }

  // async createWord(newWordData: AddWordDTO): Promise<Word> {
  async createWord(newWordDbDto: WordDbDto): Promise<Word> {
    console.log('>> createWord WordApi 1', newWordDbDto);
    const { _id, ...rest } = newWordDbDto;

    const newWord = await WordModel.create(rest);
    console.log('>> createWord WordApi 2', newWord.toObject());

    return newWord ? WordMapper.fromEntityToDomain(newWord.toObject()) : newWord;
  }

  /** use */
  // async findByUserId(userId: string): Promise<Word[] | null> {
  //   return word-model.find({ owner: userId }); //.lean();
  // }

  //// eslint-disable-next-line  @typescript-eslint/no-unused-vars
  async updateWord(userId: string, wordData: UpdateWordDto): Promise<Word> {
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

    const updatedWord = await WordModel.findOneAndUpdate(
      { owner: new Types.ObjectId(userId), _id: wordData.id },
      {
        $set: {
          text: wordData.text,
          translations: wordData.translations.map((t) => {
            const { id, ...rest } = {
              _id: t.id || new Types.ObjectId(),
              ...t,
            };
            return rest;
          }),
        },
      },
      { new: true }, // return updated document
    );

    if (!updatedWord) throw WordError.NotFound(wordData.text);
    console.log('updatedWord', updatedWord?.toObject());
    //updatedWord.toObject(); //replaceWordTranslationIds(updatedWord);
    return updatedWord ? WordMapper.fromEntityToDomain(updatedWord.toObject()) : updatedWord;
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
