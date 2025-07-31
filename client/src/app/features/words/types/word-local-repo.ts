import { Word } from '@entities/word';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';

import { Observable } from 'rxjs';

export interface IWordLocalRepo {
  getWords(): Observable<WordsResponseDTO>;
  saveWord(word: Word): Observable<void>;
  deleteWord(id: string): Observable<void>;
}
