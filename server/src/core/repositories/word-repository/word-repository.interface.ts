import { GetWordsResponse, Word } from '@core/domain/entities';
import { WordTranslation } from '@core/domain/entities';
import { WordDbDto } from '@core/domain/entities/word';
import {
  UpdateWordDto,
  WordTranslationDeleted,
  WordTranslationUpdated,
  WordUpdateBaseOperationResult,
  WordUpdateTranslationOperationResult,
} from '@core/domain/entities/word/types/word.dto';
import { TableCommonParamsRequest } from '@core/interfaces';

export interface IWordRepository {
  getAllForUser(userId: string, options: TableCommonParamsRequest): Promise<GetWordsResponse>;

  // findWord(owner: string, wordId: string): Promise<Word>;
  findById(wordId: string): Promise<Word | null>;

  findByValue(userId: string, wordValue: string): Promise<Word | null>;
  // findByUserId(userId: string): Promise<Word[] | null>;

  createWord(newWordData: WordDbDto): Promise<Word>; //: Promise<Word>;

  // updateWord(userId: string, updates: UpdateWordDto): Promise<Word>;
  deleteWord(userId: string, wordId: string): Promise<Word | null>;

  updateWordBaseInfo(userId: string, wordId: string, dto: UpdateWordDto): Promise<WordUpdateBaseOperationResult>;
  updateWordTranslations(
    userId: string,
    wordId: string,
    dto: UpdateWordDto,
  ): Promise<WordUpdateTranslationOperationResult>;

  createTranslation(userId: string, wordId: string, newTransl: WordTranslation): Promise<WordTranslation | null>;
  updateTranslation(
    userId: string,
    wordId: string,
    updTranslation: WordTranslationUpdated,
  ): Promise<WordTranslation | null>;
  deleteTranslation(userId: string, wordId: string, { id }: WordTranslationDeleted): Promise<string | null>;
}
