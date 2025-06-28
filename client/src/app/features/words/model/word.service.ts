import { WordApi } from '@entities/word/api/word.api';
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
import { WordServiceInterface } from '@features/words/types';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService implements WordServiceInterface {
  constructor(
    private wordApi: WordApi, //TODO replace to Interface and TOKEN
  ) {}

  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO> {
    return this.wordApi.getWords(reqObj);
  }

  createWord(newWord: CreateWordDTO): Observable<Word> {
    return this.wordApi.createWord(newWord);
  }

  updateWord(wordId: string, data: UpdateWordDTO): Observable<Word> {
    return this.wordApi.updateWord(wordId, data);
  }

  checkWord(wordValue: string): Observable<WordIdResponse> {
    return this.wordApi.checkWord(wordValue);
  }

  getWord(wordId: string): Observable<Word> {
    return this.wordApi.getWordById(wordId);
  }

  addTranslation(id: string, data: WordTranslation): Observable<Word> {
    return this.wordApi.addTranslation(id, data);
  }

  deleteWord(id: string): Observable<DeleteWordResponse> {
    return this.wordApi.deleteWord(id);
  }
}
