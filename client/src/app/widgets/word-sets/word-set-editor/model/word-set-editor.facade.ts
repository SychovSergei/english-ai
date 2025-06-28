import { WordSet, WordSetService } from '@entities/word-set';
import { WordItem, WordItemIsNew } from '@entities/word-set/models';
import { AddWordsDialogService } from '@features/word-set/word-import/model';
import { WordService } from '@features/words/model';
import { ELangs, EWordSetVisibility } from '@shared/enums';
import { generateUuid, markAllControlsAsTouchedAndDirty } from '@shared/utils';
import { WordSetEditorMode } from '@widgets/word-sets/word-set-editor/model/model';

import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WordSetEditorFacade {
  private mode: WordSetEditorMode = 'create';
  wordSetForm!: FormGroup;

  private _dataWords$ = new BehaviorSubject<WordItemIsNew[]>([]);
  public readonly dataWords$ = this._dataWords$.asObservable();

  INITIAL_WORD_SET: WordSet<WordItemIsNew> = {
    id: generateUuid(),
    title: '', //'create title initial in facade',
    settings: {
      allowCopy: false,
      language: ELangs.EN, //TODO get from config service ???
      visibility: EWordSetVisibility.Private,
    },
    words: [
      { id: generateUuid(), term: '', definition: '', isNew: true },
      { id: generateUuid(), term: '', definition: '', isNew: true },
    ],
  };

  private setInitialWords(words: WordItemIsNew[]): void {
    this._dataWords$.next(words);
  }

  resetDataWords(): void {
    console.log('reset dataWords$ / clear words control');
    this._dataWords$.next([]);
    this.wordGroup.clear();
  }

  constructor(
    private fb: FormBuilder,
    private wordSetService: WordSetService, //TODO через интерфейс
    private wordService: WordService, //TODO через интерфейс
    private wordImportService: AddWordsDialogService,
  ) {
    this.wordSetForm = this.fb.group({
      title: this.fb.control('', { validators: [Validators.required, Validators.min(2)], updateOn: 'change' }),
      description: this.fb.control('', []),
      words: this.fb.array([], { updateOn: 'change' }),
    });
  }

  getForm(): FormGroup {
    return this.wordSetForm;
  }

  setMode(mode: WordSetEditorMode): void {
    this.mode = mode;
  }

  isEditMode(): boolean {
    return this.mode === 'edit';
  }

  submitForm(): void {
    console.clear();
    console.log('submitForm', this.wordSetForm.valid);
    console.log('submitForm value', this.wordSetForm.getRawValue());
    console.log('submitForm controls', this.wordSetForm.controls);
    console.log(Object.keys(this.wordSetForm.controls));

    markAllControlsAsTouchedAndDirty(this.wordSetForm);

    for (const controlKey of Object.keys(this.wordSetForm.controls)) {
      // this.wordSetForm.controls[controlKey].markAsTouched();
      // this.wordSetForm.controls[controlKey].markAsPristine();
      // this.wordSetForm.controls[controlKey].markAsDirty();
      console.log(`control ${controlKey} errors`, this.wordSetForm.controls[controlKey].errors);
      console.log(`control ${controlKey} valid`, this.wordSetForm.controls[controlKey].valid);
      console.log(`control ${controlKey} value`, this.wordSetForm.controls[controlKey].getRawValue());
    }
    const words = this.wordSetForm.controls['words'] as FormArray;
    for (const key of Object.keys(words.controls)) {
      console.log(`words control ${key} errors`, words.controls[+key].errors);
      console.log(`words control ${key} valid`, words.controls[+key].valid);
      console.log(`words control ${key} value`, words.controls[+key].getRawValue());
    }

    if (this.wordSetForm.valid) {
      const formValue = this.wordSetForm.getRawValue();
      const words = this.wordGroup.getRawValue() as WordItemIsNew[];
      const fullData: WordSet<WordItemIsNew> = {
        id: this.INITIAL_WORD_SET.id,
        title: formValue.title,
        description: formValue.description,
        settings: this.INITIAL_WORD_SET.settings, // или взять из конфига
        words,
      };

      // вызов сервиса или диспатч в ngrx
      if (this.mode === 'edit') {
        this.wordSetService.updateWordSet(fullData).subscribe(() => {
          console.log('updated!');
        });
      } else {
        this.wordSetService.createWordSet(fullData).subscribe(() => {
          console.log('created!');
        });
      }
    }
  }

  public get wordGroup(): FormArray {
    return this.wordSetForm.get('words') as FormArray; //?.get(this.formArrayName) as FormGroup; //FormArray;
  }

  loadSetForCreate(): Observable<WordSet<WordItemIsNew>> {
    return of(this.INITIAL_WORD_SET).pipe(
      tap((data) => {
        console.log('FacadeService: CREATE', data);
      }),
      tap((data) => {
        this.wordSetForm.patchValue({
          title: data.title,
          description: data.description,
        });
        this.setInitialWords(
          data.words.map((word) => {
            word.isNew = true;
            return word;
          }),
        );
      }),
    );
  }

  loadSetForEdit(wordSetId: string): Observable<WordSet<WordItemIsNew>> {
    return this.wordSetService.getWordSetById(wordSetId).pipe(
      tap((data) => {
        console.log('FacadeService: EDIT', data);
      }),
      tap((data) => {
        this.wordSetForm.patchValue({
          title: data.title,
          description: data.description,
        });
        this.setInitialWords(
          data.words.map((word) => {
            word.isNew = false;
            return word;
          }),
        );
      }),
    );
  }

  /**
   * Open dialog and get data close dialog
   */
  importWordDialogOpen(): void {
    this.wordImportService.open().subscribe((result) => {
      if (result) this.setInitialWords(result);
    });
  }

  private updateWordSetData(newWords: WordItem[]): WordItem[] {
    const currentData = this._dataWords$.getValue();
    return [...currentData, ...newWords];
  }

  // save(): Observable<void> {
  //   return of();
  // }
  //
  // update(): Observable<void> {
  //   return of();
  // }
  checkTermValue(term: string): void {
    this.wordService.checkWord(term).subscribe((res) => {
      console.log(res);
    });
  }
}
