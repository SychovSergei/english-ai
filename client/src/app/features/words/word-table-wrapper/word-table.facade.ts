import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { WordsRequest } from '@entities/word/model/word.types';
import { WordService } from '@features/words';
import { WordFacadeInterface } from '@features/words/types';

import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordTableFacade implements WordFacadeInterface {
  // constructor(@Inject(WORD_SERVICE_TOKEN) private wordService: WordServiceInterface) {}
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

  // createWord(newWord: CreateWordDTO): Observable<WordFormValue> {
  //   const { translations } = newWord;
  //   const mappedTranslations = translations.map((tr) => {
  //     return { ...tr, isNew: true };
  //   });
  //   return this.wordService.createWord({ ...newWord, translations: mappedTranslations });
  // }
  //
  // checkWord(word: string): Observable<WordIdResponse> {
  //   return this.wordService.checkIfWordExists(word);
  // }

  // filterWords(reqObj: WordsRequest): Observable<WordsResponse> {
  //   const reqObject: WordsRequest = {
  //     filter: reqObj.filter || '',
  //     limit: reqObj.limit || 10,
  //     offset: reqObj.offset || 0,
  //   };
  //   return this.wordService.filterWords(reqObject); // Запрос с фильтрацией
  // }
}
