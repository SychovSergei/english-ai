import { Types } from "mongoose";

import { UserError } from "../errors/user-error";
import { IWordRequestDto, IWordResponseDTO, WordResponseDTO } from "../models/dto/word-dto";
import { IUser } from "../models/interfaces/user.interface";
import { WordError } from "../errors/word-error";
import { IWord } from "../models/interfaces/word.interface";
import { DocResponseWithId } from "../models/interfaces/mongo.interface";
import WordModel from "../models/word.model";
import userService from "./user.service";
import translationService from "./translation.service";

export class WordService {
  async getAll(): Promise<IWordResponseDTO> {
    const words = (await WordModel.find({})) as DocResponseWithId<IWord>[];
    console.log("words =", words);
    const wordDtos = [];

    for (const word of words) {
      const wordDto = new WordResponseDTO(word._id.toString(), word.originalText, word.language);
      await wordDto.loadTranslations(word.translationIds, translationService.getById);
      wordDtos.push(wordDto);
    }

    console.log("wordDtos =", wordDtos);
    return { length: wordDtos.length, data: wordDtos };
  }

  async createNewWord(newWordDto: IWordRequestDto) {
    // : Promise<WordDoc | null>
    const userId = newWordDto.userId;

    //TODO проверка юзера избыточна (если есть запрос то уже юзер должен быть)
    const user: DocResponseWithId<IUser> | null = await userService.findById(userId);
    if (!user) {
      throw UserError.NotFound();
    }

    // if (user) {
    const wordDoc = await WordModel.findOne({
      originalText: newWordDto.originalText.toLowerCase().trim(),
    }).lean<IWord>();
    // const wordDoc = (await WordModel.findById(newWordDto.id)) as (Document & IWord) | null;

    /** create 'wordId' for using in wordModel and translationModel*/
    const newWordId = new Types.ObjectId();
    if (wordDoc) {
      // console.warn("word DOC", (wordDoc as IWord & { _id: string })._id.toString());
      // TODO ЕСЛИ ЕСТЬ ТО не сохранять его заново, а предупредить пользователя что такое слово есть и
      //  предложить ему добавить переводы к существующему!!!!
      throw WordError.AlreadyExists(newWordDto.originalText);
    }

    /** сохраняем каждое значение перевода и возвращаем их id */
    const translationErrors: string[] = [];
    const translationIds: Awaited<Types.ObjectId | null>[] = await Promise.all(
      newWordDto.translations.map(async (translateItem) => {
        try {
          const translationId: Types.ObjectId | null = await translationService.saveTranslation(
            newWordId,
            translateItem,
          );
          if (translationId === null) {
            translationErrors.push(translateItem.translatedText);
          }
          return translationId;
        } catch (error) {
          translationErrors.push(translateItem.translatedText);
          return null; // return `null` to continue save other translations
        }
      }),
    );
    if (translationErrors.length) {
      //TODO надо передать пользователю какие слова не удалось сохранить
    }

    const translationIdsFiltered = translationIds.filter((id): id is Types.ObjectId => id !== null);

    const { language, originalText } = newWordDto;
    // const userId = user._id as Types.ObjectId;
    const newWordData = {
      language,
      originalText,
      _id: newWordId,
      userId: userId,
      translationIds: [...translationIdsFiltered],
    };
    const newWordCreated: DocResponseWithId<IWord> = await WordModel.create(newWordData);

    return newWordCreated;
    // }
  }

  // async update(id: string, data: any) {}
}

export default new WordService();
