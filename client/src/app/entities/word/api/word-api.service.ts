import {
  CheckWordExistsResponseDto,
  CreateWordResponseDto,
  UpdateWordDto,
  WordCheckRequest,
  WordDto,
} from '@entities/word/api/word.dto';
import { HttpApiService } from '@shared/api';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO это НОВЫЙ сервис
@Injectable({ providedIn: 'root' })
export class WordApiService {
  private readonly API_URL = 'api/words';

  constructor(private readonly httpService: HttpApiService) {}

  // TODO проверить входной тип параметра dto ???
  create(dto: Partial<WordDto>): Observable<CreateWordResponseDto> {
    return this.httpService.post<CreateWordResponseDto, Partial<WordDto>>(`${this.API_URL}`, dto);
  }

  // TODO replace any type???
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWords(params: any): Observable<WordDto[]> {
    return this.httpService.get<WordDto[]>(`${this.API_URL}`, { params });
  }

  getAll(): Observable<WordDto[]> {
    console.log('wordApiService.getAll');
    return this.httpService.get<WordDto[]>(`${this.API_URL}`);
  }

  checkWordExists(payload: WordCheckRequest): Observable<CheckWordExistsResponseDto> {
    // const params = new HttpParams().set('words', wordValues);

    return this.httpService.post<CheckWordExistsResponseDto>(`${this.API_URL}/check-exists`, payload);
  }

  /**
   * Обновление слова на сервере
   */
  update(dto: UpdateWordDto): Observable<WordDto> {
    // В REST принято передавать ID в URL
    return this.httpService.put<WordDto, UpdateWordDto>(`${this.API_URL}/${dto.id}`, dto);
  }

  delete(id: string): Observable<string> {
    return this.httpService.delete<string>(`${this.API_URL}/${id}`);
  }
}
