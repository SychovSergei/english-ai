import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { API_WORDS_URL } from './api-url.token';
import { WordTranslation } from '../../../core/interfaces/word-translation.interface';
import { API_DOMAIN } from '../../../core/tokens/api-tokens';
import { IWordService, WordActionMode } from '../interfaces/word-service.interface';
import {
  CreateWordDTO,
  CreateWordResponse,
  DeleteWordResponse,
  GetWordsResponse,
  UpdateWordDTO,
  UpdateWordResponse,
  Word,
  WordIdResponse,
} from '../interfaces/word.interface';

@Injectable({
  providedIn: 'root',
})
export class WordService implements IWordService {
  constructor(
    private http: HttpClient,
    @Inject(API_DOMAIN) private apiDomain: string, // Инжектим токен для домена
    @Inject(API_WORDS_URL) private apiUrl: string, // Инжектим токен для URL
  ) {}

  getWords(): Observable<GetWordsResponse> {
    return this.http.get<GetWordsResponse>(`${this.apiDomain}${this.apiUrl}`);
  }

  getWord(wordId: string): Observable<Word> {
    return this.http.get<Word>(`${this.apiDomain}${this.apiUrl}/${wordId}`);
  }

  // processWord(mode: 'create', data: CreateWordDTO): Observable<CreateWordResponse>;
  // processWord(mode: 'edit', data: UpdateWordDTO, id: string): Observable<UpdateWordResponse>;

  // <T extends WordActionMode>
  processWord(
    mode: WordActionMode,
    data: CreateWordDTO | UpdateWordDTO,
    id?: string,
  ): Observable<CreateWordResponse | UpdateWordResponse> {
    console.log('mode', mode);
    console.log('data', data);
    if (mode === 'create') {
      return this.createWord(data as CreateWordDTO);
    } else {
      if (!id) {
        throw new Error('ID is required for edit mode');
      }
      return this.updateWord(id, data as UpdateWordDTO);
    }
  }

  createWord(data: CreateWordDTO): Observable<CreateWordResponse> {
    return this.http.post<CreateWordResponse>(`${this.apiDomain}${this.apiUrl}`, data).pipe();
  }

  updateWord(wordId: string, data: UpdateWordDTO): Observable<UpdateWordResponse> {
    console.log('Word Id = ', data.id);
    return this.http.patch<UpdateWordResponse>(`${this.apiDomain}${this.apiUrl}/${wordId}`, data).pipe();
  }

  addTranslation(id: string, data: WordTranslation): Observable<Word> {
    return this.http.patch<Word>(`${this.apiDomain}${this.apiUrl}/${id}/add-translation`, { translation: data });
  }

  checkWord(wordValue: string): Observable<WordIdResponse> {
    const params = new HttpParams().set('word', wordValue);
    return this.http.get<WordIdResponse>(`${this.apiDomain}${this.apiUrl}/search`, { params }).pipe();
  }

  deleteWord(id: string): Observable<DeleteWordResponse> {
    return this.http.delete<DeleteWordResponse>(`${this.apiDomain}${this.apiUrl}/${id}`).pipe();
  }
}
