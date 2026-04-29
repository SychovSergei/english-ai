import { HttpApiService } from '@shared/api';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { inject, Injectable } from '@angular/core';

/**
 *  низкоуровневый API сервис
 */
@Injectable({ providedIn: 'root' })
export class WordSetApiService {
  // implements IWordSetApi
  private readonly loggerService = inject(LoggerService);

  apiUrl: string = 'api/word-sets';

  constructor(
    private httpApiService: HttpApiService,
    // @Inject(API_MODULE_URL) private apiUrl: string, // Инжектим токен для URL) {}
  ) {}

  // getById(wordSetId: string): Observable<WordSetResponseDto> {
  //   this.loggerService.log(wordSetId);
  //   return this.httpApiService.get<WordSetResponseDto>(this.apiUrl + `/${wordSetId}`).pipe(
  //     catchError((error: unknown) => {
  //       this.loggerService.log('log', error);
  //       return of({
  //         id: '12341234',
  //         title: '',
  //         ownerId: '',
  //         description: 'desc test',
  //         settings: { visibility: EWordSetVisibility.Private, language: ELangs.EN, allowCopy: false },
  //         words: [
  //           {
  //             id: '1123',
  //             language: ELangs.EN,
  //             owner: 'sfd',
  //             value: 'texxxtt',
  //             translations: [{ id: 'ddd', value: 'trans text', language: ELangs.UA, description: 'desc text' }],
  //           },
  //         ],
  //       } as WordSet<Word>);
  //     }),
  //   );
  // }

  // delete(id: string): Observable<void> {
  //   return this.httpApiService.delete(`/api/word-sets/${id}`);
  // }

  // createWordSet(dto: CreateWordSetDto): Observable<WordSetResponseDto> {
  //   // TODO return word-set with ID set and word ids
  //   this.loggerService.log('createWordSet');
  //   return this.httpApiService.post(this.apiUrl, dto);
  // }

  // updateWordSet(id: string, dto: UpdateWordSetDto): Observable<WordSetResponseDto> {
  //   return this.httpApiService.put(this.apiUrl + `/${id}`, dto);
  // }
}
