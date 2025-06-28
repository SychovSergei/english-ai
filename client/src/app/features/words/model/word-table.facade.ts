import { Word } from '@entities/word';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { CreateWordDTO, WordIdResponse, WordsRequest } from '@entities/word/model/word.model';
import { WordService } from '@features/words/model';
import { WordFacadeInterface } from '@features/words/types';

import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordTableFacade implements WordFacadeInterface {
  // constructor(@Inject(WORD_SERVICE_TOKEN) private wordService: IWordService) {}
  constructor(private wordService: WordService) {}

  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO> {
    const reqObject: WordsRequest = {
      filter: reqObj.filter || '',
      limit: reqObj.limit || 10,
      offset: reqObj.offset || 0,
      sortName: reqObj.sortName || '',
      sortDirection: reqObj.sortDirection || '',
    };
    return this.wordService.getWords(reqObject).pipe(shareReplay(1)); // 🔥 Кэшируем последний результат;
  }

  createWord(newWord: CreateWordDTO): Observable<Word> {
    return this.wordService.createWord(newWord);
  }

  checkWord(word: string): Observable<WordIdResponse> {
    return this.wordService.checkWord(word);
  }

  // filterWords(reqObj: WordsRequest): Observable<WordsResponse> {
  //   const reqObject: WordsRequest = {
  //     filter: reqObj.filter || '',
  //     limit: reqObj.limit || 10,
  //     offset: reqObj.offset || 0,
  //   };
  //   return this.wordService.filterWords(reqObject); // Запрос с фильтрацией
  // }
}
