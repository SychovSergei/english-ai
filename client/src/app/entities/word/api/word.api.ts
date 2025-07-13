import { CreateWordDTO, UpdateWordDTO } from '@entities/word/api/word.dto';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import {
  DeleteWordResponse,
  Word,
  WordIdResponse,
  WordsRequest,
  WordsResponse,
  WordTranslation,
} from '@entities/word/model/word.types';
import { HttpApiService } from '@shared/api';

// import { API_MODULE_URL } from '@shared/config/api-tokens';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export type WordUpdateOperationResult = WordUpdateBaseOperationResult & WordUpdateTranslationOperationResult;
export type WordUpdateBaseOperationResult = Pick<Word, 'id' | 'text' | 'language'>;
export type WordUpdateTranslationOperationResult = {
  translations: {
    created: OperationResult<WordTranslation | null>[];
    updated: OperationResult<WordTranslation | null>[];
    deleted: OperationResult<string | null>[];
    skipped: OperationResult<null, { message: string }>[]; // 💡 новый блок // TODO TODO TODO TODO сделать для ошибок интерфейс/класс
  };
};
type OperationResult<T, TError = unknown> = OperationSuccess<T> | OperationError<TError>;
type OperationSuccess<T> = {
  id: string | number;
  status: 'success';
  value: T;
  reason: null;
};
type OperationError<TError> = {
  id: string | number;
  status: 'error';
  value: null;
  reason: TError;
};

@Injectable({
  providedIn: 'root',
})
export class WordApi {
  // TODO  implements WordApiInterface
  apiUrl = 'api/words';

  constructor(
    private httpService: HttpApiService,
    // @Inject(API_MODULE_URL) private apiUrl: string, // Инжектим токен для URL
  ) {}

  getWords(requestObj: WordsRequest): Observable<WordsResponseDTO> {
    const params = new HttpParams()
      .set('filter', requestObj.filter)
      .set('limit', requestObj.limit.toString())
      .set('offset', requestObj.offset.toString())
      .set('sortName', requestObj.sortName.toString())
      .set('sortDirection', requestObj.sortDirection.toString());
    console.log(this.apiUrl);
    // return this.httpService.get<WordsResponse>(`${this.apiUrl}`, params).pipe(
    return this.httpService.get<WordsResponse>(`api/words`, params).pipe(
      map((response) => new WordsResponseDTO(response)),
      catchError((error) => {
        console.error('Error fetching words:', error);
        return throwError(() => new Error('Failed to load words'));
      }),
    );
  }

  checkWord(wordValue: string): Observable<WordIdResponse> {
    const params = new HttpParams().set('word', wordValue);
    // return this.http.get<WordIdResponse>(`${this.apiDomain}${this.apiUrl}/search`, params);
    return this.httpService.get<WordIdResponse>(`${this.apiUrl}/check-exists`, params);
  }

  createWord(data: CreateWordDTO): Observable<Word> {
    console.log(data);
    return this.httpService.post<Word, CreateWordDTO>(`${this.apiUrl}`, data);
  }

  updateWord(wordId: string, data: UpdateWordDTO): Observable<WordUpdateOperationResult> {
    return this.httpService.patch<WordUpdateOperationResult, UpdateWordDTO>(`${this.apiUrl}/${wordId}`, data);
  }

  getWordById(wordId: string): Observable<Word> {
    console.log('repositories service getWordById');
    return this.httpService.get<Word>(`${this.apiUrl}/${wordId}`);
  }

  addTranslation(wordId: string, data: WordTranslation): Observable<WordTranslation> {
    return this.httpService.post<WordTranslation, WordTranslation>(`${this.apiUrl}/${wordId}/translations`, data);
  }

  deleteWord(id: string): Observable<DeleteWordResponse> {
    return this.httpService.delete<DeleteWordResponse>(`${this.apiUrl}/${id}`);
  }
}
