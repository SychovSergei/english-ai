import { GetWordsResponse, Word, WordTranslation } from 'app-old/core/domain/entities';
import { WordDbDto, WordTranslationDbDto } from 'app-old/core/domain/entities/word';
import {
  UpdateWordDto,
  WordTranslationDeleted,
  WordTranslationDto,
  WordTranslationUpdated,
  WordUpdateBaseOperationResult,
  WordUpdateTranslationOperationResult,
} from 'app-old/core/domain/entities/word/types/word.dto';
import { TableCommonParamsRequest } from 'app-old/core/interfaces/common/table-common-params-request.interface';
import { IWordRepository } from 'app-old/core/repositories';
import { injectable } from 'inversify';
import { WordError } from 'modules/words/domain/errors/WordError';
import { WordTranslationError } from 'modules/words/domain/errors/WordTranslationError';
// eslint-disable-next-line boundaries/element-types
import { WordMapper } from 'modules/words/infrastructure/http/mappers/WordMapper';
// eslint-disable-next-line boundaries/element-types
import { WordModel } from 'modules/words/infrastructure/persistence';
import { Types } from 'mongoose';

// import { WordModel } from '@infrastructure/db/entities';
// import { WordTranslationSchemaType } from '@infrastructure/db/entities/word-model/word.model';

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
    // return word ? WordMapper.toDomain(word) : word; // lean().exec();

    if (!word) return null;
    return WordMapper.toDomain(word); // lean().exec();
  }

  async findById(wordId: string): Promise<Word | null> {
    const wordResult = await WordModel.findById(wordId); //.lean()
    // const res = wordResult ? wordResult.toObject() : null;
    const res = wordResult ? wordResult : null;
    console.log('>> WordApi Impl findById()', res);
    return res ? WordMapper.toDomain(res) : res;
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

    // const dataToObject = data.map((wordDoc) => WordMapper.fromEntityToDomain(wordDoc.toObject()));
    const dataToObject = data.map((wordDoc) => WordMapper.toDomain(wordDoc));
    // console.log('---------dataToObject--------');
    console.log(dataToObject);

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
      words: dataToObject,
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

  async createTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<WordTranslation | null> {
    const updatedWord = await WordModel.findOneAndUpdate(
      { owner: new Types.ObjectId(userId), _id: wordId },
      {
        // $push: { translations: { $each: [newTransl], $position: 0 } }, // Добавляем в начало или надо просто newTransl
        $push: { translations: newTransl }, // Add to the END
      },
      { new: true }, // return updated document (with new field)
    );

    console.log('updatedWord === ', updatedWord);
    if (!updatedWord) throw WordError.NotFound(wordId);

    const createdTranslation = WordMapper.toDomain(updatedWord).translations.at(-1);
    console.log('createdTranslation >>>>>>', createdTranslation, '>>>>>>');
    return createdTranslation ?? null;
  }

  async updateTranslation(
    userId: string,
    wordId: string,
    updatedTranslation: WordTranslationUpdated,
  ): Promise<WordTranslation | null> {
    const { id, ...rest } = updatedTranslation;
    const updatedWord = await WordModel.findOneAndUpdate(
      { owner: new Types.ObjectId(userId), _id: wordId, 'translations._id': id },
      {
        $set: {
          'translations.$[elem]': { ...rest, _id: id },
        },
      },
      { arrayFilters: [{ 'elem._id': id }], new: true }, // return updated document (with new field)
    );

    console.log('updatedWord === ', updatedWord);
    if (!updatedWord) throw WordError.NotFound(wordId);

    const updated = WordMapper.toDomain(updatedWord).translations.find((t) => t.id === updatedTranslation.id);
    console.log('updated >>>>>>', updated, '>>>>>>');
    return updated ?? null;
  }

  async updateWordBaseInfo(userId: string, wordId: string, dto: UpdateWordDto): Promise<WordUpdateBaseOperationResult> {
    const word = await WordModel.findById(wordId);
    if (!word) throw WordError.NotFound(wordId);

    //word.text = dto.text ?? word.text;
    word.language = dto.language ?? word.language;

    const result: WordUpdateBaseOperationResult = {
      id: wordId,
      text: word.value,
      language: word.language,
    };
    const resWord = await word.save();
    console.log('result =-=-=-=- BASE word =-=-=-=-=-', word);
    console.log('result =-=-=-=- BASE resWord from save =-=-=-=-=-', resWord);
    console.log('result =-=-=-=- BASE result=-=-=-=-=-', result);

    return result;
  }
  // TODO ----->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->->-
  async updateWordTranslations(
    userId: string,
    wordId: string,
    dto: UpdateWordDto,
  ): Promise<WordUpdateTranslationOperationResult> {
    const word = await WordModel.findById(wordId);
    if (!word) throw WordError.NotFound(wordId);

    // const translation = word?.translations[0];
    // console.log(typeof translation.toObject); // function
    // console.log(translation.toObject());

    const result: WordUpdateTranslationOperationResult = {
      // id: wordId,
      // text: word.text,
      // language: word.language,
      translations: {
        created: [],
        updated: [],
        deleted: [],
        skipped: [],
      },
    };

    // === DELETE ===
    for (const del of dto.translations.deleted) {
      const trans = word.translations.find((t) => t._id?.toString() === del.id);
      if (!trans) {
        result.translations.deleted.push({
          id: del.id,
          status: 'error',
          value: null,
          reason: WordError.NotFound(del.id),
        });
        continue;
      }

      const index = word.translations.findIndex((t) => t._id?.toString() === del.id);
      if (index !== -1) word.translations.splice(index, 1);

      result.translations.deleted.push({
        id: del.id,
        status: 'success',
        value: del.id,
        reason: null,
      });
    }

    // === UPDATE ===
    for (const upd of dto.translations.updated) {
      const currTranslationSchema = word.translations.find((t) => t._id?.toString() === upd.id);
      if (!currTranslationSchema) {
        result.translations.updated.push({
          id: upd.id,
          status: 'error',
          value: null,
          reason: WordTranslationError.NotFound(upd.text),
        });
        continue;
      }

      const keys = Object.keys(upd).filter((k) => k !== 'id');
      console.log('keyskeyskeyskeyskeyskeyskeyskeyskeyskeyskeys', keys);

      const hasChanges = keys.some((key) => {
        console.log('1', key, upd[key as keyof WordTranslationUpdated]);
        console.log('2', key, currTranslationSchema[key as keyof WordTranslationDbDto]);
        return (
          currTranslationSchema &&
          upd[key as keyof WordTranslationUpdated] !== currTranslationSchema[key as keyof WordTranslationDbDto]
        );
      });

      if (!hasChanges) {
        result.translations.skipped.push({
          id: upd.id,
          status: 'error',
          value: null,
          reason: WordError.NotFound(upd.text),
        });
        continue;
      }

      Object.assign(currTranslationSchema, upd);
      console.log('currTranslationSchema type', typeof currTranslationSchema);
      result.translations.updated.push({
        id: upd.id, //_id.toString(), //upd.id.toString(), // TODO ???
        status: 'success',
        value: toPlainTranslation(currTranslationSchema), //{ id: _id.toString(), ...rest. },
        reason: null,
      });
    }

    // === CREATE ===
    for (const newTransl of dto.translations.created) {
      console.log('newTransl>>>>>>', JSON.stringify(newTransl, null, 2));
      const alreadyExists = word.translations.some(
        (t) => t.text === newTransl.text && t.language === newTransl.language,
      );
      if (alreadyExists) {
        result.translations.skipped.push({
          id: newTransl.text, // + '/' + newTransl.language,
          status: 'error',
          value: null,
          reason: WordTranslationError.AlreadyExists(newTransl.text),
        });
        continue;
      }
      const newId = new Types.ObjectId();
      // const { _id, ...rest } = newTransl;
      const created: WordTranslationDbDto = {
        ...newTransl,
        _id: newId,
      };
      const createdDto: WordTranslationDto = {
        ...newTransl,
        id: newId.toString(),
      };
      word.translations.push(created);

      result.translations.created.push({
        id: created._id.toString(),
        status: 'success',
        value: createdDto,
        reason: null,
      });
    }
    console.log('result =-=-=-=-=-=-=-=-=-', JSON.stringify(result, null, 2));
    const wordRes = await word.save();
    console.log('result =-=word transl save result-=-=-=-=-=-=-=-', wordRes);

    return result;
  }

  async deleteTranslation(userId: string, wordId: string, { id }: WordTranslationDeleted): Promise<string | null> {
    const updatedWord = await WordModel.findOneAndUpdate(
      { owner: new Types.ObjectId(userId), _id: wordId },
      { $pull: { translations: { _id: id } } },
      { new: true },
    );

    if (!updatedWord) throw WordError.NotFound(wordId);

    const stillExists = updatedWord.translations.find((t) => t._id?.toString() === id);
    if (stillExists) return null;
    return stillExists ? null : id;
  }

  // async createWord(newWordData: AddWordDTO): Promise<Word> {
  async createWord(newWordDbDto: WordDbDto): Promise<Word> {
    console.log('>> createWord WordApi 1', newWordDbDto);
    const { _id, ...rest } = newWordDbDto;

    const newWord = await WordModel.create(rest);
    console.log('>> createWord WordApi 2', newWord.toObject());

    return newWord ? WordMapper.fromEntityToDomain(newWord) : newWord;
  }

  /** use */
  // async findByUserId(userId: string): Promise<Word[] | null> {
  //   return word-model.find({ owner: userId }); //.lean();
  // }

  //// eslint-disable-next-line  @typescript-eslint/no-unused-vars
  /**async updateWord(userId: string, wordData: UpdateWordDto): Promise<Word> {
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
  }*/

  async deleteWord(userId: string, wordId: string): Promise<Word | null> {
    const deletedWord = await WordModel.findOneAndDelete({ owner: new Types.ObjectId(userId), _id: wordId });
    if (!deletedWord) {
      throw WordError.NotFound(wordId);
    }
    return deletedWord ? WordMapper.fromEntityToDomain(deletedWord) : null;
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
// function toPlainTranslation(t: HydratedDocument<WordTranslation>): WordTranslationDto {
function toPlainTranslation(t: WordTranslationSchemaType): WordTranslationDto {
  // const plain = t.toObject();
  return {
    id: t._id.toString(),
    text: t.text,
    language: t.language,
    description: t.description ?? '',
    difficultyLevel: t.difficultyLevel,
    lexicalCategory: t.lexicalCategory,
  };
}
