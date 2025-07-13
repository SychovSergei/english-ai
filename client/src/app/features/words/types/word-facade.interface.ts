import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { WordsRequest } from '@entities/word/model/word.types';

import { Observable } from 'rxjs';

export interface WordFacadeInterface {
  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO>;
  // filterWords(reqObj: WordsRequest): Observable<WordsResponse>;

  // TODO change WordsRequest/WordsResponse type
  //checkWord(word: string): Observable<WordIdResponse>;

  //createWord(newWord: CreateWordDTO): Observable<WordFormValue>;
}
