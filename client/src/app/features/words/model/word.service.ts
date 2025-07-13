import { WordApi } from '@entities/word/api/word.api';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { DeleteWordResponse, WordsRequest } from '@entities/word/model/word.types';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  // TODO implements WordServiceInterface
  constructor(
    private wordApi: WordApi, //TODO replace to Interface and TOKEN
  ) {}

  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO> {
    return this.wordApi.getWords(reqObj);
  }

  deleteWord(id: string): Observable<DeleteWordResponse> {
    return this.wordApi.deleteWord(id);
  }
}
