import { LoggerService } from '@shared/lib/logger/logger.service';

import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordFormFacade {
  //TODO Am I using this FACADE???????
  private readonly loggerService = inject(LoggerService);

  // constructor(
  //   private wordApi: WordApi, //TODO Am I using this ???????
  //   private wordFacade: WordFacade,
  // ) {}

  /** createWord(newWord: WordFormValue): Observable<WordFormValue> {
    const createWordDto = this.toWordCreateDTO(newWord);
    const createWordDt = WordMapper.toDomain(createWordDto);

    // return this.wordApi.createWord(createWordDto).pipe(map(mapWordToFormValue));
    return this.wordFacade.addWord(createWordDt);
  }*/

  // updateWord(wordValue: WordFormValue, initValue: WordFormValue): Observable<WordUpdateOperationResult> {
  //   const updateWordDto = this.toWordUpdateDTO(wordValue, initValue);
  //   this.loggerService.log('> > > updateWordDto >>', updateWordDto);
  //   return this.wordApi.updateWord(wordValue.id, updateWordDto).pipe(
  //     tap((val) => {
  //       console.log('**********');
  //       val.translations.created.forEach((t) => {
  //         this.loggerService.log('>> id     >', t.id);
  //         this.loggerService.log('>> status >', t.status);
  //         this.loggerService.log('>> value  >', t.value);
  //         this.loggerService.log('>> reason >', t.reason);
  //       });
  //     }),
  //     map((word) => {
  //       // word.translations.created.forEach((t) => {
  //       //
  //       // });
  //       return word;
  //     }),
  //   );
  // }

  // TODO может отдельно в helper/mapper ????
  // private toWordUpdateDTO(wordValue: WordFormValue, initValue: WordFormValue): UpdateWordDTO {
  //   // private toWordUpdateDTO(wordValue: WordFormValue, initValue: WordFormValue): WordPatchPayload {
  //   return this.buildWordPatchPayload(wordValue, initValue);
  // }

  // TODO private???
  // buildWordPatchPayload(formValue: WordFormValue, init: WordFormValue): WordPatchPayload {
  //   const baseChanges = getObjectChanges(formValue, init);
  //   console.log(baseChanges);
  //   console.log(formValue.translations);
  //   console.log(init.translations);
  //   const formValueTrans = this._mapTranslations(formValue.translations);
  //   const initValueTrans = this._mapTranslations(init.translations);
  //   const translations: PatchChange<WordTranslation> = getArrayDiff(formValueTrans, initValueTrans);
  //   console.log(translations);
  //
  //   return { ...baseChanges, translations };
  // }

  // TODO может отдельно в helper/mapper ????
  // private toWordCreateDTO(wordData: WordFormValue): CreateWordDTO {
  //   const translations = this._mapTranslations(wordData.translations);
  //   return {
  //     id: wordData.id ?? '',
  //     value: wordData.value.toString().trim() || '',
  //     language: wordData.language || ELangs.EN,
  //     translations: translations,
  //   };
  // }

  // private _mapTranslations(translations: WordFormTranslation<WordTranslation>[]): WordTranslation[] {
  //   return translations.map((tran) => {
  //     const { translText, ...rest } = tran;
  //     return {
  //       ...rest,
  //       value: translText.toString().trim(),
  //     };
  //   });
  // }

  // checkIfWordExists(wordValue: string): Observable<WordIdResponse> {
  //   return this.wordApi.checkWord(wordValue);
  // }

  // addTranslation(
  //   id: string,
  //   data: WordFormTranslation<WordTranslation>,
  // ): Observable<WordFormTranslation<WordTranslation>> {
  //   const { translText, ...rest } = data;
  //   const transformData: WordTranslation = {
  //     ...rest,
  //     value: translText.toString().trim(),
  //   };
  //   return this.wordApi.addTranslation(id, transformData).pipe(
  //     map((data) => {
  //       const { value, ...rest } = data;
  //       return {
  //         ...rest,
  //         translText: value,
  //       };
  //     }),
  //   );
  // }

  /** getWordById(wordId: string): Observable<WordFormValue> {
    return this.wordApi.getWordById(wordId).pipe(map(mapWordToFormValue));
  }*/
}
