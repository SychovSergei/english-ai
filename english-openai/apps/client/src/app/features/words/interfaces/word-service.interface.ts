import { Observable } from 'rxjs';

import {
  CreateWordDTO,
  CreateWordResponse,
  DeleteWordResponse,
  GetWordsResponse,
  UpdateWordDTO,
  UpdateWordResponse,
  Word,
  WordIdResponse,
} from './word.interface';
import { WordTranslation } from '../../../core/interfaces/word-translation.interface';

export type WordActionMode = 'create' | 'edit';

export interface IWordService {
  getWords(): Observable<GetWordsResponse>;
  getWord(wordId: string): Observable<Word>;
  createWord(data: CreateWordDTO): Observable<CreateWordResponse>;
  updateWord(id: string, data: UpdateWordDTO): Observable<UpdateWordResponse>;
  addTranslation(id: string, data: WordTranslation): Observable<Word>;
  checkWord(wordValue: string): Observable<WordIdResponse>;
  deleteWord(id: string): Observable<DeleteWordResponse>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processWord(mode: WordActionMode, word: UpdateWordDTO): Observable<any>;
}
