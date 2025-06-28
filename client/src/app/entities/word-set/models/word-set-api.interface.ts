import { CreateWordSetDto, UpdateWordSetDto, WordSetResponseDto } from '@entities/word-set/api/dtos';

import { Observable } from 'rxjs';

export interface IWordSetApi {
  getById(id: string): Observable<WordSetResponseDto>;
  createWordSet(dto: CreateWordSetDto): Observable<WordSetResponseDto>;
  updateWordSet(id: string, dto: UpdateWordSetDto): Observable<WordSetResponseDto>;
  delete(id: string): Observable<void>;
}
