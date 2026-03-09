import { GetWordsResponse, Word } from 'app-old/core/domain/entities';
import { WordTranslation } from 'app-old/core/domain/entities';
import { WordDbDto } from 'app-old/core/domain/entities/word';
import {
  UpdateWordDto,
  WordTranslationDeleted,
  WordTranslationUpdated,
  WordUpdateBaseOperationResult,
  WordUpdateTranslationOperationResult,
} from 'app-old/core/domain/entities/word/types/word.dto';
import { TableCommonParamsRequest } from 'app-old/core/interfaces/common/table-common-params-request.interface';

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
