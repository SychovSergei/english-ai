import { WordSet } from '@core/domain/entities';
import { UpdateWordDto } from '@core/domain/entities/word/types/create-word.dto';
import { WordSetDbDto } from '@core/domain/entities/word-set/types/word-set-db.dto';

export interface IWordSetRepository {
  createWordSet(wordSetEntity: WordSetDbDto): Promise<WordSet>; //: Promise<Word>;
  updateWordSet(userId: string, wordData: UpdateWordDto): Promise<WordSet>;
}
