import { WordSet } from '@entities/word-set';
import { WordSetResponseDto } from '@entities/word-set/api/dtos';
import { WordItem } from '@entities/word-set/models/ui/word-item.model';

import { Observable } from 'rxjs';

export interface IWordSetService {
  getWordSetById(wordSetId: string): Observable<WordSet<WordItem>>;
  // create(wordSet: WordSet<WordItem>): Observable<string>;
  createWordSet(wordSet: WordSet<WordItem>): Observable<WordSetResponseDto>;
  updateWordSet(wordSet: WordSet<WordItem>): Observable<WordSetResponseDto>;
}
