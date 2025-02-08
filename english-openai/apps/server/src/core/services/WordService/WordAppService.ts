import { WordError } from "../../errors/WordError";
import WordModel from "../../../infractructure/db/entities/WordModel";
import { GetWordsResponse, UpdateWordDTO, Word, wordSchema } from "../../entities/Word/word-schema";
import { Validation } from "../../../infractructure/services/validator";
import { WordTranslation } from "../../../infractructure/db/entities/schemas/word-translation-schema";
import { Types } from "mongoose";
import { inject, injectable } from "inversify";
import { IWordRepository } from "../../repositories/WordRepository/WordRepository";
import { TYPES } from "../../../infractructure/di/types";
import { AddWordDTO, addWordDTOSchema } from "../../repositories/WordRepository/dto/addWordDto";

/** БИЗНЕС ЛОГИКА
 *  (Любые методы) */
@injectable()
export class WordAppService {
  constructor(@inject(TYPES.WordRepository) private wordRepository: IWordRepository) {}

  async getAll(userId: string): Promise<GetWordsResponse> {
    // const words = await WordModel.find({ owner: userId });
    const words = await this.wordRepository.findByUserId(userId);
    if (!words) {
      throw WordError.NotFound();
    }

    // for (const word of words) {
    //   const wordDto = new WordResponseDTO(word._id.toString(), word.text, word.language);
    //   await wordDto.loadTranslations(word.translations, translationService.getById);
    //   wordDtos.push(wordDto);
    // }
    // console.log("words------", words);
    const wordsFormated = words.map((word) => {
      const wordObj = word.toObject();
      const newTranslations: WordTranslation[] = wordObj.translations.map((translation) => {
        const { _id, ...rest } = translation;
        return {
          ...rest,
          id: _id?.toString(),
        };
      });
      const { _id, ...rest } = wordObj;
      const resWord: Word = {
        ...rest,
        owner: wordObj.owner!.toString(),
        translations: newTranslations,
        id: _id?.toString() || wordObj.id!.toString(),
      };

      return resWord;
    });

    // console.log("wordsFormated =", wordsFormated);
    return {
      total: wordsFormated.length,
      data: wordsFormated,
    };
  }

  async findById(wordId: string): Promise<Word> {
    console.log("word ID =====", wordId);
    const word = await WordModel.findById(wordId); //.lean().exec(); // as DocResponseWithId<Word>[];
    // TODO --- WordModel.findById заменить сервисом

    if (!word) {
      throw WordError.NotFound(wordId);
    }

    const wordObject = word.toObject();
    const newTranslations: WordTranslation[] = wordObject.translations.map((translation) => {
      const { _id, ...rest } = translation;
      return {
        ...rest,
        id: _id?.toString(),
      };
    });

    const wordObj: Word = {
      id: word._id.toString(),
      text: word.text,
      language: word.language,
      owner: word.owner,
      isPublic: word.isPublic,
      translations: newTranslations,
      relatedForms: word.relatedForms,
      sentences: word.sentences,
      createdAt: word.createdAt,
    };
    console.log(">>>>>>>>> wordObj", wordObj);

    return wordObj;
  }

  // async findById(userId: string, wordId: string): Promise<Word | null> {
  //   const word = await WordModel.findById(wordId).exec();
  //   if (!word) {
  //     throw WordError.NotFound(wordId);
  //   }
  //   const wordObject = word?.toObject();
  //
  //   console.log("wordObject id =======", wordObject?.id);
  //   console.log("wordObject owner =======", wordObject?.owner);
  //   console.log("wordObject =======", wordObject);
  //
  //   return wordObject ? wordObject : word;
  // }

  async findByValue(userId: string, wordValue: string): Promise<Word | null> {
    // const objectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : null;
    // if (!objectId) {
    //   throw new Error("Invalid userId format");
    // }

    // const userIdObjectId = new Types.ObjectId(userId);
    // console.log(userIdObjectId);

    // console.log(typeof userIdObjectId);
    // , owner: userIdObjectId
    // const word = await WordModel.findOne({ text: wordValue }).lean();
    // Затем фильтруем по owner на уровне JavaScript
    // const filteredWords = words.filter((word) => word.owner?.toString() === userId);
    const word = await WordModel.findOne({ text: wordValue })
      .populate({
        path: "owner", // Связанное поле
        match: { _id: userId }, // Условие фильтрации
        select: "id", // Поля, которые нужно вернуть
      })
      .exec();
    const wordObject = word?.toObject();

    console.log("wordObject =======", wordObject || "слова нет");
    if (wordObject) {
      console.log("wordObject id =======", wordObject?.id || "слова нет");
      console.log("wordObject owner =======", wordObject?.owner || "слова нет");
    }

    // if (word && word.owner && word.owner.toString() === userId) {
    //   // Найдено слово с соответствующим владельцем
    //   console.log("Found word:", word);
    // } else {
    //   // Слово не найдено или владелец не совпадает
    //   console.log("Word not found or owner mismatch");
    // }

    // if (filteredWords.length > 0) {
    //   // Найдено слово с соответствующим владельцем
    //   const word = filteredWords[0];
    //   console.log("Found word:", word);
    // } else {
    //   // Слово не найдено
    //   console.log("Word not found or owner mismatch");
    // }
    console.log("--word---", word);
    // wordObject ? wordObject :
    return word;
  }

  async addTranslation(wordId: string, newTransl: WordTranslation): Promise<Word> {
    const newTranslation: WordTranslation = {
      id: new Types.ObjectId(),
      text: newTransl.text,
      language: newTransl.language,
      description: newTransl.description,
      lexicalCategory: newTransl.lexicalCategory,
      difficultyLevel: newTransl.difficultyLevel,
    };
    const word = await WordModel.findById(wordId).lean();
    if (!word) {
      throw WordError.NotFound();
    }
    if (word.translations.some((item) => item.text === newTranslation.text)) {
      throw WordError.BadRequest("translation", "Translation already exists!");
    }

    const updatedWord = await WordModel.findByIdAndUpdate(
      wordId,
      {
        $push: { translations: { $each: [newTranslation], $position: 0 } }, // Добавляем в начало
      },
      // { $addToSet: { translations: newTranslation } },
      { new: true },
    ).lean();

    if (!updatedWord) {
      throw WordError.NotFound();
    }

    return updatedWord;
  }

  // async createNewWord(userId: string, newWordDto: CreateWordDTO) {
  async createWord(newWordData: Word): Promise<Word> {
    /** сохраняем каждое значение перевода и возвращаем их id */
    // const translationErrors: string[] = [];
    // const translationIds: Awaited<Types.ObjectId | null>[] = await Promise.all(
    //   newWordDto.translations.map(async (translateItem) => {
    //     try {
    //       const translationId: Types.ObjectId | null = await translationService.saveTranslation(
    //         newWordId,
    //         translateItem,
    //       );
    //       if (translationId === null) {
    //         translationErrors.push(translateItem.text);
    //       }
    //       return translationId;
    //     } catch (error) {
    //       translationErrors.push(translateItem.text);
    //       return null; // return `null` to continue save other translations
    //     }
    //   }),
    // );
    // if (translationErrors.length) {
    //   //TODO надо передать пользователю какие слова не удалось сохранить
    // }
    // const translationIdsFiltered = translationIds.filter((id): id is Types.ObjectId => id !== null);

    // const newWordData: Word = {
    //   owner: userId,
    //   isPublic: false,
    //   text: newWordDto.text,
    //   language: newWordDto.language,
    //   // description: newWordDto.description,
    //   relatedForms: newWordDto.relatedForms,
    //   difficultyLevel: newWordDto.difficultyLevel,
    //   translations: newWordDto.translations,
    //   sentences: newWordDto.sentences,
    //   createdAt: new Date(),
    // };
    console.log("Попытка сохранить", newWordData);
    Validation.validate<AddWordDTO>(newWordData, addWordDTOSchema, "word");

    // const newWordCreated: Word = (await WordModel.create(newWordData)).toObject(); //: DocResponseWithId<Word>
    const newWordCreated = (await this.wordRepository.createWord(newWordData)).toObject(); //: DocResponseWithId<Word>
    console.log("Попытка сохранить удачная");

    return newWordCreated.;
    // }
  }

  async updateWord(userId: string, updates: UpdateWordDTO): Promise<Word> {
    const { id, text, translations } = updates;
    if (!id) {
      throw WordError.NotFound(text);
    }

    // Проверяем, что основной объект существует
    const existingWordDoc = await WordModel.findById(id);

    // const existingWord = await this.wordService.findWord(userId, id.toString());
    if (!existingWordDoc) {
      throw WordError.NotFound(text);
    }
    if (existingWordDoc!.owner!.toString() !== userId) {
      throw WordError.AccessDenied("Update word error: incorrect user id.");
    }

    // 1. Update main word mean
    existingWordDoc.text = text;
    // 2. Обрабатываем массив translations
    const updatedTranslations = translations.map((translation) => {
      return translation.id
        ? translation
        : {
            ...translation,
            id: new Types.ObjectId(),
          };
    });
    // Remove old translations, which is absented in new tanslations
    const newTranslationIds = updatedTranslations.map((t) => t.id?.toString());
    existingWordDoc.translations = existingWordDoc.translations.filter((t) =>
      newTranslationIds.includes(t.id?.toString()),
    );
    // Update or add new translations
    updatedTranslations.forEach((newTranslation) => {
      const index = existingWordDoc.translations.findIndex((t) => t.id?.toString() === newTranslation.id?.toString());
      if (index === -1) {
        existingWordDoc.translations.push(newTranslation);
      } else {
        existingWordDoc.translations[index] = {
          ...existingWordDoc.translations[index],
          ...newTranslation,
        };
      }
    });
    // Save updated document
    const updatedWord = await existingWordDoc.save();
    const wordData: Word = updatedWord.toObject();
    console.log(wordData);

    return wordData;
  }
}
