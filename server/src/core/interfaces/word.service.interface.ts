import { GetWordsResponse, Word } from '@core/domain/entities';
import { WordTranslation } from '@core/domain/entities';
import { CreateWordDto, UpdateWordDto } from '@core/domain/entities/word/types/create-word.dto';
import { TableCommonParamsRequest } from '@core/interfaces';

export interface IWordService {
  getAll(userId: string, options: TableCommonParamsRequest): Promise<GetWordsResponse>;
  findById(wordId: string): Promise<Word>;
  findByValue(userId: string, wordValue: string): Promise<Word | null>;

  createWord(userId: string, newWordData: CreateWordDto): Promise<Word>;
  updateWord(userId: string, updates: UpdateWordDto): Promise<Word>;
  addTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<Word>;
}
