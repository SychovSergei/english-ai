import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import {
  CreateWordDTO,
  DeleteWordResponse,
  UpdateWordDTO,
  Word,
  WordIdResponse,
  WordsRequest,
  WordTranslation,
} from '@entities/word/model/word.model';

import { Observable } from 'rxjs';

export interface WordServiceInterface {
  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO>;
  // filterWords(reqObj: WordsRequest): Observable<WordsResponse>;
  checkWord(wordValue: string): Observable<WordIdResponse>;
  createWord(data: CreateWordDTO): Observable<Word>;
  updateWord(id: string, data: UpdateWordDTO): Observable<Word>;
  getWord(wordId: string): Observable<Word>;

  deleteWord(id: string): Observable<DeleteWordResponse>;

  addTranslation(id: string, data: WordTranslation): Observable<Word>;

  // processWord(mode: WordActionMode, word: UpdateWordDTO): void;
}
