import { Word } from '@entities/word';
import { CreateWordSetDto, UpdateWordSetDto, WordSetResponseDto } from '@entities/word-set/api/dtos';
import { IWordSetApi, WordSet } from '@entities/word-set/models';
import { ELangs, EWordSetVisibility } from '@shared/enums';
import { HttpApiService } from '@shared/infrastructure';

import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

/**
 *  низкоуровневый API сервис
 */
@Injectable({ providedIn: 'root' })
export class WordSetApiService implements IWordSetApi {
  apiUrl: string = 'api/word-sets';

  constructor(
    private httpApiService: HttpApiService,
    // @Inject(API_MODULE_URL) private apiUrl: string, // Инжектим токен для URL) {}
  ) {}

  getById(wordSetId: string): Observable<WordSetResponseDto> {
    console.log(wordSetId);
    return this.httpApiService.get<WordSetResponseDto>(this.apiUrl + `/${wordSetId}`).pipe(
      catchError((error: unknown) => {
        console.log(error);
        return of({
          id: '12341234',
          title: '',
          ownerId: '',
          description: 'desc test',
          settings: { visibility: EWordSetVisibility.Private, language: ELangs.EN, allowCopy: false },
          words: [
            {
              id: '1123',
              language: ELangs.EN,
              owner: 'sfd',
              text: 'texxxtt',
              translations: [{ id: 'ddd', text: 'trans text', language: ELangs.UA, description: 'desc text' }],
            },
          ],
        } as WordSet<Word>);
      }),
    );
  }

  delete(id: string): Observable<void> {
    return this.httpApiService.delete(`/api/word-sets/${id}`);
  }

  createWordSet(dto: CreateWordSetDto): Observable<WordSetResponseDto> {
    // TODO return word-set with ID set and word ids
    console.log('createWordSet');
    return this.httpApiService.post(this.apiUrl, dto);
  }

  updateWordSet(id: string, dto: UpdateWordSetDto): Observable<WordSetResponseDto> {
    return this.httpApiService.put(this.apiUrl + `/${id}`, dto);
  }
}
