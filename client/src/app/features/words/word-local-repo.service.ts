import { Word, WordTranslation } from '@entities/word';
import { WordItemDTO, WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { DeleteWordResponse, WordIdResponse } from '@entities/word/model/word.types';
import { NgxIndexedDBService } from 'ngx-indexed-db';

// import { WordServiceInterface } from '@features/words/types';
// import { IWordLocalRepo } from '@features/words/types/word-local-repo';
// import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

import { WordFormTranslation, WordFormValue } from './add-word-dialog/model/word-form.types';
// import { CreateWordDTO } from '@entities/word/api/word.dto';

// interface MyDBV1 extends DBSchema {
//   'favourite-number': { key: string; value: number };
// }

// export class WordLocalRepoService implements IWordLocalRepo {
@Injectable({ providedIn: 'root' })
export class WordLocalRepoService {
  // implements WordServiceInterface
  //// eslint-disable-next-line @typescript-eslint/no-explicit-any
  #dbService = inject(NgxIndexedDBService);

  constructor(/**private db: IDBPDatabase<any>*/) {
    this.#dbService.getAll('words').subscribe((words) => {
      console.log('words', words);
    });
  }

  getWords(): Observable<WordsResponseDTO> {
    // return from(this.indexedDbGetWords());
    return this.#dbService.getAll<Word>('words').pipe(
      map((words) => {
        return { words, total: words.length };
      }),
    );
  }

  saveWord(word: Word): Observable<Word> {
    // return from(this.indexedDbSaveWord(word));
    this.#dbService.add('words', word).pipe(
      tap((wordWithId) => {
        console.log(wordWithId);
      }),
    );
    //return; //createWord(data: CreateWordDTO): Observable<Word>
    console.log(word);
    return of({} as Word);
  }

  updateWord(id: string, word: WordItemDTO): Observable<WordFormValue> {
    // return from(this.updateWordLocal(wordValue, initValue));
    this.#dbService.update('words', word).subscribe({
      // next: () => console.log(`Слово ${word.id} успешно обновлено/добавлено.`),
      error: (err) => console.error(`Ошибка обновления слова ${word.id}:`, err),
    });
    console.log(id, word);
    return of({} as WordFormValue);
  }

  deleteWord(id: string): Observable<DeleteWordResponse> {
    // return from(this.indexedDbDeleteWord(id));
    console.log(id);
    return of({ success: true, message: 'test response' } as DeleteWordResponse);
  }

  addTranslation(id: string, data: WordFormTranslation<WordTranslation>): Observable<WordTranslation> {
    // return from(this.addTranslationLocal(id, data));
    console.log(id, data);
    return of({} as WordTranslation);
  }

  // private async addTranslationLocal(id: string, data: WordFormTranslation<WordTranslation>): Promise<WordTranslation> {
  //   const word: Word = await this.db.get('words', id);
  //   word.translations.push({ ...data, text: data.translText });
  //   await this.db.put('words', word);
  //   return word;
  // }

  checkIfWordExists(wordValue: string): Observable<WordIdResponse> {
    // return from(this.checkWordLocal(wordValue));
    console.log(wordValue);
    return of({ id: null });
  }

  createWord(data: WordFormValue): Observable<WordFormValue> {
    // return from(this.createWordLocal(data));
    console.log(data);
    return of({} as WordFormValue);
  }

  getWordById(id: string): Observable<WordFormValue> {
    // return from(this.getWordLocal(id));
    console.log(id);
    return of({} as WordFormValue);
  }

  // private async indexedDbGetWords(): Promise<WordsResponseDTO> {
  //   const words = await this.db.getAll('words');
  //   return { words, total: words.length };
  // }
  //
  // private async indexedDbSaveWord(word: Word): Promise<void> {
  //   await this.db.put('words', word);
  // }
  // private async indexedDbDeleteWord(id: string): Promise<DeleteWordResponse> {
  //   await this.db.delete('words', id);
  //   return {
  //     success: true,
  //     message: 'string',
  //   };
  // }

  // Приватные методы с Promise
  // private async createWordLocal(data: WordFormValue): Promise<WordFormValue> {
  //   await this.db.add('words', data);
  //   return data;
  // }

  // private async getWordLocal(id: string): Promise<WordFormValue> {
  //   return await this.db.get('words', id);
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // private async updateWordLocal(word: WordFormValue, init: WordFormValue): Promise<WordFormValue> {
  //   await this.db.put('words', word);
  //   return word;
  // }

  // private async checkWordLocal(wordValue: string): Promise<WordIdResponse> {
  //   const allWords = await this.db.getAll('words');
  //   const existing = allWords.find((w) => w.value === wordValue);
  //   return { id: existing?.id || null };
  // }
}
