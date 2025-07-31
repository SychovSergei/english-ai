import { WordUpdateOperationResult } from '@entities/word/api/word.api';
import { UpdateWordDTO } from '@entities/word/api/word.dto';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { DeleteWordResponse, WordIdResponse, WordsRequest, WordTranslation } from '@entities/word/model/word.types';
import { WordFormTranslation, WordFormValue } from '@features/words/add-word-dialog/model/word-form.types';

import { Observable } from 'rxjs';

export interface WordServiceInterface {
  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO>;
  // filterWords(reqObj: WordsRequest): Observable<WordsResponse>;
  checkIfWordExists(wordValue: string): Observable<WordIdResponse>;
  createWord(data: WordFormValue): Observable<WordFormValue>;
  updateWord(wordId: string, data: UpdateWordDTO): Observable<WordUpdateOperationResult>;
  getWordById(id: string): Observable<WordFormValue>;

  deleteWord(id: string): Observable<DeleteWordResponse>;

  addTranslation(id: string, data: WordFormTranslation<WordTranslation>): Observable<WordTranslation>;

  // processWord(mode: WordActionMode, word: UpdateWordDTO): void;
}
