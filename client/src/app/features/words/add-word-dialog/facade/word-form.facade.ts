import { WordApi, WordUpdateOperationResult } from '@entities/word/api/word.api';
import { CreateWordDTO, PatchChange, UpdateWordDTO, WordPatchPayload } from '@entities/word/api/word.dto';
import { WordIdResponse, WordTranslation } from '@entities/word/model/word.types';
import { WordService } from '@features/words';
import { getArrayDiff, getObjectChanges } from '@features/words/add-word-dialog/model/form.helpers';
import { mapWordToFormValue } from '@features/words/add-word-dialog/model/word-form.mapper';
import { WordFormTranslation, WordFormValue } from '@features/words/add-word-dialog/model/word-form.types';
import { ELangs } from '@shared/enums';

import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordFormFacade {
  constructor(
    private wordApi: WordApi, //TODO replace to Interface and TOKEN
    private wordService: WordService, //TODO replace to Interface and TOKEN
  ) {}

  createWord(newWord: WordFormValue): Observable<WordFormValue> {
    const createWordDto = this.toWordCreateDTO(newWord);

    return this.wordApi.createWord(createWordDto).pipe(map(mapWordToFormValue));
  }

  updateWord(wordValue: WordFormValue, initValue: WordFormValue): Observable<WordUpdateOperationResult> {
    const updateWordDto = this.toWordUpdateDTO(wordValue, initValue);
    console.log('> > > updateWordDto >>', updateWordDto);
    return this.wordService.updateWord(wordValue.id, updateWordDto).pipe(
      tap((val) => {
        console.log('**********');
        val.translations.created.forEach((t) => {
          console.log('>> id     >', t.id);
          console.log('>> status >', t.status);
          console.log('>> value  >', t.value);
          console.log('>> reason >', t.reason);
        });
      }),
      map((word) => {
        // word.translations.created.forEach((t) => {
        //
        // });
        return word;
      }),
    );
  }

  // TODO может отдельно в helper/mapper ????
  private toWordUpdateDTO(wordValue: WordFormValue, initValue: WordFormValue): UpdateWordDTO {
    return this.buildWordPatchPayload(wordValue, initValue);
  }

  // TODO private???
  buildWordPatchPayload(formValue: WordFormValue, init: WordFormValue): WordPatchPayload {
    const baseChanges = getObjectChanges(formValue, init);
    console.log(baseChanges);
    console.log(formValue.translations);
    console.log(init.translations);
    const formValueTrans = this._mapTranslations(formValue.translations);
    const initValueTrans = this._mapTranslations(init.translations);
    const translations: PatchChange<WordTranslation> = getArrayDiff(formValueTrans, initValueTrans);
    console.log(translations);

    return { ...baseChanges, translations };
  }

  // TODO может отдельно в helper/mapper ????
  private toWordCreateDTO(wordData: WordFormValue): CreateWordDTO {
    const translations = this._mapTranslations(wordData.translations);
    return {
      id: wordData.id ?? '',
      text: wordData.text.toString().trim() || '',
      language: wordData.language || ELangs.EN,
      translations: translations,
    };
  }

  private _mapTranslations(translations: WordFormTranslation<WordTranslation>[]): WordTranslation[] {
    return translations.map((tran) => {
      const { translText, ...rest } = tran;
      return {
        ...rest,
        text: translText.toString().trim(),
      };
    });
  }

  checkIfWordExists(wordValue: string): Observable<WordIdResponse> {
    return this.wordApi.checkWord(wordValue);
  }

  addTranslation(
    id: string,
    data: WordFormTranslation<WordTranslation>,
  ): Observable<WordFormTranslation<WordTranslation>> {
    const { translText, ...rest } = data;
    const transformData: WordTranslation = {
      ...rest,
      text: translText.toString().trim(),
    };
    return this.wordApi.addTranslation(id, transformData).pipe(
      map((data) => {
        const { text, ...rest } = data;
        return {
          ...rest,
          translText: text,
        };
      }),
    );
  }

  getWordById(wordId: string): Observable<WordFormValue> {
    return this.wordApi.getWordById(wordId).pipe(map(mapWordToFormValue));
  }
}
