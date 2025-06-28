import { GetWordsResponse, Word } from '@core/domain/entities';
import { WordTranslation } from '@core/domain/entities';
import { WordDbDto } from '@core/domain/entities/word';
import { UpdateWordDto } from '@core/domain/entities/word/types/create-word.dto';
import { TableCommonParamsRequest } from '@core/interfaces';

export interface IWordRepository {
  getAllForUser(userId: string, options: TableCommonParamsRequest): Promise<GetWordsResponse>;

  // findWord(owner: string, wordId: string): Promise<Word>;
  findById(wordId: string): Promise<Word | null>;

  findByValue(userId: string, wordValue: string): Promise<Word | null>;
  // findByUserId(userId: string): Promise<Word[] | null>;

  createWord(newWordData: WordDbDto): Promise<Word>; //: Promise<Word>;

  updateWord(userId: string, updates: UpdateWordDto): Promise<Word>;

  addTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<Word | null>;
}
