import { WordSet } from '@core/domain/entities';
import { CreateWordSetDto, UpdateWordSetDto } from '@core/domain/entities/word-set/types/create-word-set.dto';

export interface IWordSetService {
  createWordSet(newWordSetData: CreateWordSetDto, userId: string): Promise<WordSet>;
  updateWordSet(updates: UpdateWordSetDto, userId: string): Promise<WordSet>;
}
