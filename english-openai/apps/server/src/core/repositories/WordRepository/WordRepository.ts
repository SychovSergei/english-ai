import { GetWordsResponse, UpdateWordDTO, Word } from "../../entities/Word/word-schema";
import { WordTranslation } from "../../../infractructure/db/entities/schemas/word-translation-schema";
import { AddWordDTO } from "./dto/addWordDto";
import { DocResponseWithId } from "../../../infractructure/interfaces--/mongo.interface";
import { Document } from "mongoose";

export interface IWordRepository {
  getAll(userId: string): Promise<GetWordsResponse>;
  // findWord(owner: string, wordId: string): Promise<Word>;
  findById(wordId: string): Promise<Word | null>;
  findByValue(userId: string, wordValue: string): Promise<Word | null>;
  findByUserId(userId: string): Promise<Word[] | null>;

  // createWord(newWordData: AddWordDTO): Promise<DocResponseWithId<Word>>; //: Promise<Word>;
  // createWord(newWordData: AddWordDTO): Promise<Document<unknown, unknown, Word>>; //: Promise<Word>;
  createWord(newWordData: AddWordDTO): Promise<Word>; //: Promise<Word>;

  addTranslation(wordId: string, newTransl: WordTranslation): Promise<Word>;
  updateWord(userId: string, updates: UpdateWordDTO): Promise<Word>;
}
