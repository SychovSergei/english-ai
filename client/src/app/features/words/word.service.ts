import { WordApi, WordUpdateOperationResult } from '@entities/word/api/word.api';
import { UpdateWordDTO } from '@entities/word/api/word.dto';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { DeleteWordResponse, WordIdResponse, WordsRequest, WordTranslation } from '@entities/word/model/word.types';
import { UserService } from '@features/user/model/user.service';
import { WordFormTranslation, WordFormValue } from '@features/words/add-word-dialog/model/word-form.types';
import { WordServiceInterface } from '@features/words/types';
import { WordLocalRepoService } from '@features/words/word-local-repo.service';
import { NetworkService } from '@shared/infrastructure';

import { Injectable } from '@angular/core';
import { Observable, of, tap /** tap */ } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService implements WordServiceInterface {
  constructor(
    private wordApi: WordApi, //TODO replace to Interface and TOKEN
    private wordLocalRepoService: WordLocalRepoService,
    private networkService: NetworkService,
    private userService: UserService,
  ) {}

  getWords(reqObj: WordsRequest): Observable<WordsResponseDTO> {
    console.log('getWords>> reqObj>>>>>', reqObj);
    console.log('getWords>> isOnline()>>>>>', this.networkService.isOnline());
    console.log('getWords>> userData>>>>>', this.userService.userData());

    // && this.userService.getCurrentUser()?.id
    if (this.networkService.isOnline()) {
      console.log('ONLINE AUTHORIZED');
      return this.wordApi.getWords(reqObj).pipe(
        tap((words) => {
          words.words.forEach((word) => {
            this.wordLocalRepoService.updateWord(word.id, word);
          });
        }),
      );
    } else {
      console.log('OFF LINE user => ', this.userService.getCurrentUser());
      // TODO create IndexedDBService
      return this.wordLocalRepoService.getWords(reqObj); //.pipe(tap((data) => console.log(data)));
    }
  }

  updateWord(wordId: string, data: UpdateWordDTO): Observable<WordUpdateOperationResult> {
    return this.wordApi.updateWord(wordId, data);
  }

  // TODO надо ли и куда?
  deleteWord(id: string): Observable<DeleteWordResponse> {
    return this.wordApi.deleteWord(id);
  }

  addTranslation(id: string, data: WordFormTranslation<WordTranslation>): Observable<WordTranslation> {
    console.log(id, data);
    return of({} as WordTranslation);
  }

  checkIfWordExists(wordValue: string): Observable<WordIdResponse> {
    console.log(wordValue);
    return of({} as WordIdResponse);
  }

  createWord(data: WordFormValue): Observable<WordFormValue> {
    console.log(data);
    return of({} as WordFormValue);
  }

  getWordById(id: string): Observable<WordFormValue> {
    console.log(id);
    return of({} as WordFormValue);
  }
}
