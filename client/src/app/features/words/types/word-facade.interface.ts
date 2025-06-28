import { Word } from '@entities/word';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { CreateWordDTO, WordIdResponse, WordsRequest } from '@entities/word/model/word.model';

import { Observable } from 'rxjs';

export interface WordFacadeInterface {
  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO>;
  // filterWords(reqObj: WordsRequest): Observable<WordsResponse>;

  // TODO change WordsRequest/WordsResponse type
  checkWord(word: string): Observable<WordIdResponse>;

  createWord(newWord: CreateWordDTO): Observable<Word>;
}
