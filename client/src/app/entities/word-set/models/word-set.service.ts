import { wordFormMapper } from '@entities/word-set';
import { CreateWordSetDto, UpdateWordSetDto, WordSetResponseDto } from '@entities/word-set/api/dtos';
import { WordSetApiService } from '@entities/word-set/api/word-set.api';
import { IWordSetService, WordItemIsNew, WordSet } from '@entities/word-set/models';
import { wordSetMapper } from '@entities/word-set/models/word-set.mappers';

import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

/**
 * бизнес-логика (добавить, удалить, валидировать)
 * Валидация или трансформация (если нужно) данных
 */
// TODO использовать мапперы!!!!!!!!!!!!!
//  Валидация или трансформация (если нужно)
@Injectable({ providedIn: 'root' })
export class WordSetService implements IWordSetService {
  constructor(private wordSetApi: WordSetApiService) {}

  getWordSetById(wordSetId: string): Observable<WordSet<WordItemIsNew>> {
    // export type WordSetResponseDto = WordSet<Word>;
    return this.wordSetApi.getById(wordSetId).pipe(
      tap((data) => console.log(data)),

      /* transform incoming data to necessary format by mapper */
      map((res) => {
        const wordMapped = wordFormMapper.fromServerToForm(res.words);
        return { ...res, words: wordMapped };
      }),
    );
  }

  createWordSet(wordSet: WordSet<WordItemIsNew>): Observable<WordSetResponseDto> {
    // TODO WordSetResponseDto или string при ответе от сервера
    const dto: CreateWordSetDto = wordSetMapper.toCreateDto(wordSet);
    return this.wordSetApi.createWordSet(dto);
  }

  updateWordSet(wordSet: WordSet<WordItemIsNew>): Observable<WordSetResponseDto> {
    const dto: UpdateWordSetDto = wordSetMapper.toUpdateDto(wordSet);
    return this.wordSetApi.updateWordSet(wordSet.id, dto);
  }
}
