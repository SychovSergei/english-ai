import { GetWordsResponse, Word } from 'app-old/core/domain/entities';
import { WordTranslation } from 'app-old/core/domain/entities';
import {
  CreateWordDto,
  UpdateWordDto,
  WordUpdateOperationResult,
} from 'app-old/core/domain/entities/word/types/word.dto';
import { TableCommonParamsRequest } from 'app-old/core/interfaces';

export interface IWordService {
  getAll(userId: string, options: TableCommonParamsRequest): Promise<GetWordsResponse>;
  findById(wordId: string): Promise<Word>;
  findByValue(userId: string, wordValue: string): Promise<Word | null>;

  createWord(userId: string, newWordData: CreateWordDto): Promise<Word>;
  updateWord(userId: string, updates: UpdateWordDto): Promise<WordUpdateOperationResult>;
  deleteWord(userId: string, id: string): Promise<Word | null>;

  addTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<WordTranslation>;
}
