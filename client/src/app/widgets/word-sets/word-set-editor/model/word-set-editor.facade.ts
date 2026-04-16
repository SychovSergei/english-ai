import { SessionFacade } from '@entities/session';
import { EWordSetVisibility, WordItem, WordItemIsNew, WordSet, WordSetSettings } from '@entities/word-set';
import { AddWordsDialogService } from '@features/word-set/word-import/model';
import { ELangs } from '@shared/enums';
import { OwnerId } from '@shared/lib/auth/owner-id.vo';
import { markAllControlsAsTouchedAndDirty } from '@shared/utils';
import { WordSetEditorMode } from '@widgets/word-sets';

import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, filter, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WordSetEditorFacade {
  private sessionFacade = inject(SessionFacade);

  private mode: WordSetEditorMode = 'create';
  wordSetForm!: FormGroup;

  private _dataWords$ = new BehaviorSubject<WordItemIsNew[]>([]);
  public readonly dataWords$ = this._dataWords$.asObservable();

  // ({},generateCompactId(),{
  //   title: '', //'create title initial in facade',
  //   settings: {
  //     allowCopy: false,
  //     language: ELangs.EN, //TODO get from config service ???
  //     visibility: EWordSetVisibility.PRIVATE,
  //   },
  //   words: [
  //     { id: generateCompactId(), term: '', definition: '', isNew: true },
  //     { id: generateCompactId(), term: '', definition: '', isNew: true },
  //   ],
  // });

  private setInitialWords(words: WordItemIsNew[]): void {
    this._dataWords$.next(words);
  }

  resetDataWords(): void {
    console.log('reset dataWords$ / clear words control');
    this._dataWords$.next([]);
    this.wordGroup.clear();
  }

  // INITIAL_WORD_SET: WordSet<WordItemIsNew> | null = null;
  INITIAL_WORD_SET: WordSet | null = null;

  constructor(
    private fb: FormBuilder,

    private wordImportService: AddWordsDialogService,
  ) {
    const owner = this.sessionFacade.snapshot;
    if (!owner) {
      throw new Error('Owner not found');
    }
    this.INITIAL_WORD_SET = WordSet.create(
      {
        description: 'new word set description',
        title: 'new word set title',
        settings: WordSetSettings.create({
          allowCopy: false,
          language: ELangs.EN,
          visibility: EWordSetVisibility.PRIVATE,
        }),
        wordIds: [],
      },
      OwnerId.fromRaw({
        id: owner.id,
        role: owner.role,
        kind: owner.kind,
      }),
    );

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
    console.log('Object.keys(this.wordSetForm.controls)', Object.keys(this.wordSetForm.controls));

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
      // const formValue = this.wordSetForm.getRawValue();
      // const words = this.wordGroup.getRawValue() as WordItemIsNew[];
      // const fullData: WordSet = {
      //   id: this.INITIAL_WORD_SET.id,
      //   title: formValue.title,
      //   // description: formValue.description,
      //   // settings: this.INITIAL_WORD_SET.getProps().settings, // или взять из конфига
      //   // words,
      // };
      //
      // // вызов сервиса или диспатч в ngrx
      // if (this.mode === 'edit') {
      //   this.wordSetService.updateWordSet(fullData).subscribe(() => {
      //     console.log('updated!');
      //   });
      // } else {
      //   this.wordSetService.createWordSet(fullData).subscribe(() => {
      //     console.log('created!');
      //   });
      // }
    }
  }

  public get wordGroup(): FormArray {
    return this.wordSetForm.get('words') as FormArray; //?.get(this.formArrayName) as FormGroup; //FormArray;
  }

  // loadSetForCreate(): Observable<WordSet<WordItemIsNew>> {
  loadSetForCreate(): Observable<WordSet> {
    return of(this.INITIAL_WORD_SET).pipe(
      filter((data) => !!data),
      tap((data) => {
        console.log('FacadeService: CREATE', data);
      }),
      tap((data) => {
        this.wordSetForm.patchValue({
          title: data.title,
          description: data.getProps().description,
        });
        // this.setInitialWords(
        //   data.wordIds.map((word) => {
        //     // word.isNew = true;
        //     return word;
        //   }),
        // );
      }),
    );
  }

  // loadSetForEdit(wordSetId: string): Observable<WordSet<WordItemIsNew>> {
  // loadSetForEdit(wordSetId: string): Observable<WordSet> {
  //   return this.wordSetService.getWordSetById(wordSetId).pipe(
  //     tap((data) => {
  //       console.log('FacadeService: EDIT', data);
  //     }),
  //     // tap((data) => {
  //     //   this.wordSetForm.patchValue({
  //     //     title: data.title,
  //     //     description: data.getProps().description,
  //     //   });
  //     //   // this.setInitialWords(
  //     //   //   data.words.map((word) => {
  //     //   //     word.isNew = false;
  //     //   //     return word;
  //     //   //   }),
  //     //   // );
  //     // }),
  //   );
  // }

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkTermValue(term: string): void {
    // this.wordService.checkIfWordExists(term).subscribe((res) => {
    //   console.log(res);
    // });
  }
}
