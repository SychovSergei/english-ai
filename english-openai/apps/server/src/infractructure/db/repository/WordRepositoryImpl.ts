import { IWordRepository } from "../../../core/repositories/WordRepository/WordRepository";
import { WordTranslation } from "../entities/schemas/word-translation-schema";
import { GetWordsResponse, UpdateWordDTO, Word } from "../../../core/entities/Word/word-schema";
import { Document } from "mongoose";
// import { undefined } from "zod";
import WordModel from "../entities/WordModel";
import { AddWordDTO } from "../../../core/repositories/WordRepository/dto/addWordDto";
import { DocResponseWithId } from "../../interfaces--/mongo.interface";

// НЕПОСРЕДСТВЕННО С БАЗОЙ ОПЕРАЦИИ
/** операции, связанные с хранением и извлечением данных */
export class WordRepository implements IWordRepository {
  async addTranslation(wordId: string, newTransl: WordTranslation): Promise<Word> {
    return {} as Word;
  }

  // async createWord(newWordData: AddWordDTO): Promise<DocResponseWithId<Word>> {
  // async createWord(newWordData: AddWordDTO): Promise<Document<unknown, unknown, Word>> {
  //   return WordModel.create(newWordData);
  // }
  async createWord(newWordData: AddWordDTO): Promise<Word> {
    const newWord = await WordModel.create(newWordData);
    return newWord.toObject(); // Убирает Mongoose-методы, оставляет только данные
  } /** done */

  async findById(wordId: string): Promise<Word | null> {
    return WordModel.findById(wordId).lean();
  }

  /** use */
  async findByUserId(userId: string): Promise<Word[] | null> {
    return WordModel.find({ owner: userId }); //.lean();
  }

  async findByValue(userId: string, wordValue: string): Promise<Word | null> {
    return {} as Word;
  }

  async getAll(userId: string): Promise<GetWordsResponse> {
    return {} as GetWordsResponse;
  }

  async updateWord(userId: string, updates: UpdateWordDTO): Promise<Word> {
    return {} as Word;
  }
}
