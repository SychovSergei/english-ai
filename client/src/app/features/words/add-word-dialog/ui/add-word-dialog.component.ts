import {
  CheckWordVariantResponseDto,
  CreateWordPayload,
  UpdateWordPayload,
  WordFacade,
  WordTranslation,
} from '@entities/word';
import {
  checkIsFormChanged,
  OpenDialogWordData,
  removeFormGroupsWithEmptyValuesIn,
  WordFormBaseControls,
  WordFormTranslation,
  WordFormValue,
} from '@features/words';
// } from '@features/words/add-word-dialog/model/form.helpers';
import { CustomSpinnerDirective } from '@shared/directives/custom-spinner.directive';
import { ELangs, ELevels, ELexicalCategory } from '@shared/enums';
import { INotificationService } from '@shared/lib/notification-service.interface';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/lib/tokens/notification-service.token';
import { DialogComponent } from '@shared/ui';
import { UiKitModule } from '@shared/ui/ui-kit';
import { addControlError, removeControlError } from '@shared/utils';

import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, take, tap } from 'rxjs';
// import { WordTranslation } from '@entities/word/model/vo';

type PropertyType<T, K extends keyof T> = T[K];

type IdType = PropertyType<WordFormValue, 'id'>;
type TextType = PropertyType<WordFormValue, 'value'>;
type LanguageType = PropertyType<WordFormValue, 'language'>;

type WordTranslationForm = FormGroup<{
  [K in keyof WordFormTranslation<WordTranslation>]: FormControl<WordFormTranslation<WordTranslation>[K] | null>;
}>;

type WordForm = FormGroup<{
  id: FormControl<IdType>;
  value: FormControl<TextType>;
  language: FormControl<LanguageType>;
  translations: FormArray<WordTranslationForm>; // FormArray содержит FormControls или FormGroups
}>;

@Component({
  imports: [
    MatDialogModule,
    DialogComponent,
    UiKitModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    JsonPipe,
    CustomSpinnerDirective,
    CdkTextareaAutosize,
    AsyncPipe,
  ],
  selector: 'app-add-word-dialog',
  templateUrl: './add-word-dialog.component.html',
  styleUrls: ['./add-word-dialog.component.scss'],
  standalone: true,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWordDialogComponent implements OnInit {
  // TODO Am I using this component??????
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  public isEditMode: WritableSignal<boolean> = signal(false);

  public isLoading: WritableSignal<boolean> = signal(false);
  public isWordLoading: WritableSignal<boolean> = signal(false);
  public isSubmitting: WritableSignal<boolean> = signal(false);
  public isButtonDisabled: WritableSignal<boolean> = signal(false);
  public isFormChanged: WritableSignal<boolean> = signal(false);

  private variants: WritableSignal<CheckWordVariantResponseDto[]> = signal([]);

  private _isWordLoaded: boolean = false;
  private _loadedWord: string = '';
  private _isDataChangedSuccessful: boolean = false;
  private _translateDefaultLang: ELangs = ELangs.UA; // TODO - must load from config

  wordForm: WordForm;

  get idCtrl(): FormControl<IdType> {
    return this.wordForm.get('id') as FormControl;
  }
  get textCtrl(): FormControl<TextType> {
    return this.wordForm.get('value') as FormControl;
  }
  get languageCtrl(): FormControl<LanguageType> {
    return this.wordForm.get('language') as FormControl;
  }
  get translationsCtrl(): FormArray {
    //<WordTranslationForm> {
    return this.wordForm.get('translations') as FormArray; //<WordTranslationForm>;
  }

  private _levelSelector: string[] | null = null;
  get levelValues(): string[] {
    if (!this._levelSelector) return (this._levelSelector = Object.values(ELevels));
    return this._levelSelector;
  }

  private _lexicalSelector: string[] | null = null;
  get lexicalValues(): string[] {
    return (this._lexicalSelector ??= Object.values(ELexicalCategory));
  }

  private initialValues: WordFormValue = {
    id: '',
    value: '',
    language: ELangs.EN,
    translations: [
      {
        id: '', // TODO сгенерировать начальный индекс для перевода ?????
        translText: '',
        description: '',
        lexicalCategory: ELexicalCategory.Empty,
        difficultyLevel: ELevels.Empty,
        language: this._translateDefaultLang,
      },
    ],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private wordData: OpenDialogWordData,
    private dialogRef: MatDialogRef<AddWordDialogComponent>,
    @Inject(NOTIFICATION_SERVICE_TOKEN) private notificationService: INotificationService,
    // @Inject(WORD_SERVICE_TOKEN) private wordService: WordServiceInterface,
    // private wordFormFacadeOld: WordFormFacade,
    public wordFormFacade: WordFacade, // TODO public
  ) {
    const { data, mode } = this.wordData;
    // const initVal = mode === 'edit' && data ? WordFormMapper.toForm(data) : this.initialValues;
    const initVal = mode === 'edit' && data ? data : this.initialValues;

    this.wordForm = this.createForm(initVal);

    if (mode === 'edit') {
      this.isEditMode.set(true);
      this._loadedWord = initVal.value ?? '';
      this.updateBaseControls(initVal);
      // this.updateTranslationControls(data.translations, !this.isEditMode());
      this.updateTranslationControls(initVal.translations);
    }

    this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);
  }

  ngOnInit(): void {
    // this.resetFormState();
    this.listenToFormChanges();
    this.listenToTextControlChanges();
  }

  private listenToFormChanges(): void {
    this.wordForm.valueChanges
      .pipe(
        debounceTime(1000), // Проверка изменений раз в 300 мс
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        // tap(() => {
        //   console.log(
        //     'getChanges',
        //     this.wordForm.getRawValue(),
        //     getChanges(this.wordForm.getRawValue() as WordFormValue, this.initialValues),
        //   );
        // }),
        map(() => {
          return checkIsFormChanged<WordFormValue>(this.wordForm.getRawValue() as WordFormValue, this.initialValues);
        }),
        takeUntilDestroyed(this.destroyRef),
        tap((changed) => {
          // console.log('wordForm changed:', changed);
          this.isFormChanged.set(changed);
        }),
      )
      .subscribe();
  }

  private listenToTextControlChanges(): void {
    this.textCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1500),
        distinctUntilChanged(), // ignore if value don't change
        map((val) => val?.toString().trim() as string),
        filter((val) => val !== this._loadedWord),
        filter((val) => val.length >= 2),
        tap(() => this.isLoading.set(true)),
        switchMap(
          (wordValue) =>
            this.wordFormFacade.checkWordExistence(wordValue).pipe(
              tap((res) => {
                this.isLoading.set(false);
                console.log('res', res);
                // console.log('res.variants', res.variants);
                if (res.exists) {
                  this.variants.set(res.variants); // Сохраняем омонимы в сигнал

                  // Назначаю в контрол значение id слова
                  this.idCtrl.setValue(res.variants[0].id, { emitEvent: false });
                  if (res.variants.length)
                    this.notificationService.showInfo(`Найдено омонимов: ${res.variants.length}`);
                } else {
                  if (res.variants.length)
                    this.notificationService.showInfo(`Найдено омонимов: ${res.variants.length}`);
                }
              }),
              catchError((err) => {
                console.error('checkWord error', err);
                this.isLoading.set(false);
                return of(null);
              }),
            ),
          // .subscribe(),
        ),
      )
      .subscribe((res) => {
        this.isLoading.set(false);
        const alreadyExists = !!res?.exists;

        if (alreadyExists) {
          /** if word exists in DB, and we are in CREATE MODE => set idCtrl  */
          // if (!this._isWordLoaded && !this.isEditMode()) this.idCtrl.setValue(res?.wordId ?? '', { emitEvent: false });

          addControlError(this.textCtrl, 'alreadyExists', true);
          // this.textControl.setErrors({ alreadyExists: true });
          this.isButtonDisabled.set(true);
          this.notificationService.showError('This word already exists!');
          this.markControlsAsTouched(this.wordForm);
        } else {
          /** If word doesn't exist in DB => reset idCtrl if CREATE MODE.
           *  It allows not to change idCtrl on UPDATE MODE (when idCtrl is known) */
          if (!this.isEditMode()) this.idCtrl.setValue('', { emitEvent: false });
          removeControlError(this.textCtrl, 'alreadyExists');
          this.isButtonDisabled.set(false);
        }
      });
  }

  onSubmit(): void {
    console.log(this.wordForm.invalid, this.isSubmitting());
    if (this.wordForm.invalid || this.isSubmitting()) return;
    console.log('onSubmit BUTTON');

    this.isSubmitting.set(true);

    // Собираем данные из формы обратно в структуру Payload
    const formRaw = this.wordForm.getRawValue() as WordFormValue;

    // TODO надо ли?
    //  if (this.wordForm.invalid) {
    //   this.wordForm.markAllAsTouched();
    //   this.wordForm.markAsDirty();
    //   this.focusFirstInvalidControl(this.wordForm);
    //   // console.log('FORM INVALID => CANCEL');
    //   return;
    //  }

    const translations = formRaw.translations.map((t) => ({
      id: t.id || '',
      value: t.translText.trim(),
      language: t.language as ELangs,
      description: t.description,
      lexicalCategory: t.lexicalCategory,
      difficultyLevel: t.difficultyLevel,
    }));
    // TODO не надо трансформировать, недо просто передать данные формы
    //  Трансформация будет происходить в фасаде???????

    if (this.isEditMode() && this.idCtrl.value) {
      // const updateWordDto = this.toWordUpdateDTO(); //TODO надо в ФАСАД переместить
      console.log('UPDATE data:', this.idCtrl.value /*, updateWordDto*/);

      const updatePayload: UpdateWordPayload = {
        id: this.idCtrl.value,
        value: this.wordForm.get('value')?.value as string,
        language: this.wordForm.get('language')?.value as ELangs,
        translations: translations,
        //   this.translationsCtrl.value.map((t) => ({
        //   id: t.id || '',
        //   value: t.translText ? t.translText.toString().trim() : '',
        //   language: t.language as ELangs,
        //   description: t.description ?? '',
        //   lexicalCategory: t.lexicalCategory as ELexicalCategory,
        //   difficultyLevel: t.difficultyLevel as ELevels,
        //   /* sense: null,
        //   isPublic: false,
        //   image: null,*/
        // })),
        sense: null, // TODO Добавьте поля, если они есть в форме
        isPublic: false,
        image: null,
      };
      // Вызываем фасад и НЕ ЖДЕМ ответа сервера для закрытия
      this.wordFormFacade
        .updateWord(updatePayload)
        .then(() => {
          this._isDataChangedSuccessful = true;
          this.isSubmitting.set(false);
          // this.closeDialog();
        })
        .catch(() => this.isSubmitting.set(false))
        .finally(() => this.isSubmitting.set(false));
      // .updateWord(this.wordForm.getRawValue() as WordFormValue, this.initialValues)
      /**.pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res: WordUpdateOperationResult) => {
            // console.log(res);
            this.updateBaseControls(res);
            this.updateTranslationCtrls(res);
            this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);

            // this.isFormChanged.set(
            //   checkIsFormChanged<WordFormValue>(this.wordForm.getRawValue() as WordFormValue, this.initialValues),
            // );
            this.isSubmitting.set(false);
            this._isDataChangedSuccessful = true;

            this.notificationService.showSuccess('Word was UPDATED successful!');
          },
          error: (err) => {
            console.log(err);
            this.isSubmitting.set(false);
            this.notificationService.showError('Something went wrong... UPDATE');
          },
        });*/
    }
    if (!this.isEditMode()) {
      /** CREATE mode (submit) */
      console.log('CREATE WORD BUTTON CLICK');
      const createPayload: CreateWordPayload = {
        // id: this.idCtrl.value, // ??????
        value: formRaw.value,
        language: formRaw.language,
        translations: translations,
        //   this.translationsCtrl.value.map((t) => ({
        //   id: t.id || '',
        //   value: t.translText ? t.translText.toString().trim() : '',
        //   language: t.language as ELangs,
        //   description: t.description ?? '',
        //   lexicalCategory: t.lexicalCategory as ELexicalCategory,
        //   difficultyLevel: t.difficultyLevel as ELevels,
        //   /* sense: null,
        //   isPublic: false,
        //   image: null,*/
        // })),
        sense: null,
        isPublic: false,
        image: null,
      };

      this.wordFormFacade
        .createWord(createPayload)
        .then((res) => {
          this._isDataChangedSuccessful = true;
          // this.closeDialog();
          this.isEditMode.set(true);
          if (res) this.idCtrl.setValue(res, { emitEvent: false });
        })
        .catch(() => this.isSubmitting.set(false))
        .finally(() => this.isSubmitting.set(false));
      /** this.wordFormFacade.createWord(this.wordForm.getRawValue() as WordFormValue);
      .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            // console.log(res);
            // console.log('res.id', res.id);
            this._loadedWord = res.value;

            this.updateBaseControls(res);
            this.updateTranslationControls(res.translations);

            this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);

            this.isEditMode.set(true);
            this.isSubmitting.set(false);
            this._isDataChangedSuccessful = true;
            this.notificationService.showSuccess('Word was created successful!');
          },
          error: (err) => {
            console.log(err);
            this.isSubmitting.set(false);
            this.notificationService.showError('Something went wrong...');
          },
        }); */
    }
  }

  /** add translation to existing word */
  // public addTranslationItem(translationControl: AbstractControl, index: number): void {
  //   const transData = translationControl.value as WordFormTranslation<WordTranslation>;
  //   if (this.idCtrl.value) {
  //     // this.wordFormFacade // TODO implement ?????
  //     //   .addTranslation(this.idCtrl.value, transData)
  //     //   .pipe(takeUntil(this._destroy$))
  //     //   .subscribe({
  //     //     next: (translation: WordFormTranslation<WordTranslation>) => {
  //     //       this.updateTranslationControl(translation, index);
  //     //       this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);
  //     //
  //     //       this._isDataChangedSuccessful = true;
  //     //       this.notificationService.showSuccess('Translation was added successful!');
  //     //     },
  //     //     error: (error: CustomHttpErrorResponse<ApiErrorInterface>) => {
  //     //       // console.log(error.error);
  //     //       if (error.error.code === 'word-translation/already-exists') {
  //     //         this.notificationService.showError(error.error.message || 'Translation was not added! Try again.');
  //     //         this.translationsCtrl
  //     //           .at(index)
  //     //           .get('text')
  //     //           ?.setErrors({ translationError: { message: error.error.message } });
  //     //       }
  //     //     },
  //     //   });
  //   }
  // }

  public removeTranslationItem(index: number): void {
    // this.isFormChanged.set(true);
    this.translationsCtrl.removeAt(index);
  }

  public loadWord(): void {
    console.log('loadWord -> idCtrl =', this.idCtrl.value);

    // TODO Выбрать из загруженных variants(), передать id варианта и по нему загрузить слово из базы
    if (!this.idCtrl.value || this.isEditMode()) return;
    this.isWordLoading.set(true);

    // TODO implement getById()
    this.wordFormFacade
      .getWordFromStorageById(this.idCtrl.value)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.isEditMode.set(true);
          this.isButtonDisabled.set(false);
        }),
      )
      .subscribe({
        next: (result) => {
          console.log('Word loaded = ', result);
          this._isWordLoaded = true;
          if (!this._loadedWord) this._loadedWord = result.value;

          this.updateBaseControls(result);
          /** update error list for textControl */
          this.updateTextErrorList();

          /** remove empty Translate Input groups */
          removeFormGroupsWithEmptyValuesIn(this.translationsCtrl, 'translText');

          // const translations: WordFormTranslation<WordTranslation>[] = result.translations;
          const translations = result.translations;
          console.log('translations', translations);
          const res: WordFormValue = {
            id: result.id,
            value: result.value,
            language: result.language,
            translations: translations.map((t) => ({
              id: t.id,
              translText: t.value, // TODO
              language: t.language,
              description: t.description,
              lexicalCategory: t.lexicalCategory,
              difficultyLevel: t.difficultyLevel,
            })),
          };
          // translations.forEach((translation: WordFormTranslation<WordTranslation>) => {
          // translations.forEach((translation) => {
          res.translations.forEach((translation) => {
            this.addTranslationControls(translation);
          });
          this.memorizeInitialValues(res);
          this.isWordLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isWordLoading.set(false);
        },
      });
  }

  /**
   * Добавляет новую группу перевода в список контролов формы.
   *
   * @param translation - объект перевода с полями; если не указан — будет создан с пустыми значениями.
   */
  public addTranslationControls({
    id = '',
    language, // = this._translateDefaultLang,
    translText = '',
    description = '',
    lexicalCategory = ELexicalCategory.Empty,
    difficultyLevel = ELevels.Empty,
  }: Partial<WordFormTranslation<WordTranslation>> = {}): void {
    /** добавляем новую группу перевода */
    const newItemGroup = this.fb.group({
      id: [id],
      language: [language],
      translText: [translText, Validators.required],
      description: [description],
      lexicalCategory: [lexicalCategory],
      difficultyLevel: [difficultyLevel],
    });

    this.translationsCtrl.push(newItemGroup, { emitEvent: this.isEditMode() });
  }

  /** define all inputs as touched */
  private markControlsAsTouched(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      // Если это FormGroup, то рекурсивно вызываем markAsTouched для всех контролов в группе
      Object.values(control.controls).forEach((ctrl) => this.markControlsAsTouched(ctrl));
    } else if (control instanceof FormArray) {
      // Если это FormArray, то рекурсивно вызываем markAsTouched для всех контролов в массиве
      control.controls.forEach((ctrl) => this.markControlsAsTouched(ctrl));
    } else {
      // Если это FormControl, то просто вызываем markAsTouched
      control.markAsTouched();
    }
  }

  /**
   * Сохраняет переданные значения формы как исходные (начальные),
   * чтобы в дальнейшем можно было сравнивать текущие данные с этими значениями
   * и определить, были ли изменения в форме.
   *
   * @param formValue - Значения формы, которые нужно запомнить как начальные
   */
  private memorizeInitialValues(formValue: WordFormValue): void {
    this.initialValues = formValue;
  }

  private updateBaseControls(word: WordFormBaseControls): void {
    // console.log(word);
    this.wordForm.patchValue(
      {
        id: word.id,
        value: word.value,
        language: word.language,
      },
      { emitEvent: false },
    );
  }

  private updateTranslationControl(transItem: WordFormTranslation<WordTranslation>, index: number): void {
    // console.log(index, transItem);
    this.translationsCtrl.controls[index].patchValue(
      {
        id: transItem.id, //TODO delete empty string
        translText: transItem.translText,
        language: transItem.language,
        description: transItem.description,
        lexicalCategory: transItem.lexicalCategory,
        difficultyLevel: transItem.difficultyLevel,
      },
      // { emitEvent: false },
    );
  }

  private updateTranslationControls(translations: WordFormTranslation<WordTranslation>[]): void {
    this.translationsCtrl.controls.forEach((control: AbstractControl, index) => {
      if (control instanceof FormGroup) {
        control.patchValue({ ...translations[index] }, { emitEvent: false });
      }
    });
  }

  // private updateTranslationCtrls({ translations }: WordUpdateTranslationOperationResult): void {
  //   for (const operationKey of Object.keys(translations)) {
  //     // console.log(operationKey);
  //     switch (operationKey) {
  //       case 'created':
  //         // console.log('translations.created', translations.created);
  //         for (const keyElement of translations.created) {
  //           // console.log('keyElement', keyElement);
  //           if (keyElement.status === 'success') {
  //             const ctrl = this.translationsCtrl.controls.find(
  //               (ctrl) => ctrl.get('translText')?.value === keyElement.value?.value,
  //             );
  //             if (ctrl && keyElement) {
  //               ctrl.patchValue(
  //                 {
  //                   translText: keyElement.value?.value,
  //                   id: keyElement.value?.id,
  //                   language: keyElement.value?.language,
  //                   description: keyElement.value?.description,
  //                   lexicalCategory: keyElement.value?.lexicalCategory,
  //                   difficultyLevel: keyElement.value?.difficultyLevel,
  //                 },
  //                 { emitEvent: true },
  //               );
  //             }
  //             console.log('<><><>', ctrl?.getRawValue());
  //           }
  //         }
  //         break;
  //       case 'updated':
  //         console.log('translations.updated', translations.updated);
  //         break;
  //       case 'deleted':
  //         console.log('translations.deleted', translations.deleted);
  //         break;
  //       case 'skipped':
  //         console.log('translations.skipped', translations.skipped);
  //
  //         for (const keyElement of translations.skipped) {
  //           // console.log('keyElement', keyElement);
  //           if (keyElement.status === 'error') {
  //             const ctrl = this.translationsCtrl.controls.find(
  //               (ctrl) => ctrl.get('translText')?.value === keyElement.id && ctrl.get('id')?.value === '',
  //             );
  //             if (ctrl && keyElement) {
  //               ctrl.get('translText')?.setErrors({ alreadyExists: keyElement.reason!.message! || 'Already...' });
  //             }
  //             console.log('<><><>', ctrl?.getRawValue());
  //           }
  //         }
  //
  //         break;
  //       default:
  //         console.log('------default-------');
  //         break;
  //     }
  //   }
  // }

  private updateTextErrorList(): void {
    // TODO нужна ли?
    const errors = this.textCtrl.errors;
    if (errors) {
      delete errors['alreadyExists'];
      this.textCtrl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ success: this._isDataChangedSuccessful }); // Передаем данные при закрытии
  }

  private createForm(data: WordFormValue): WordForm {
    const form: WordForm = this.fb.group({
      id: this.fb.control(data.id, { nonNullable: true }),
      value: this.fb.control(data.value, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      language: this.fb.control(data.language, { nonNullable: true }), // TODO - must load from config
      translations: this.fb.array<WordTranslationForm>([]),
    });

    const translationsArray = form.controls.translations;

    for (const tr of data.translations) {
      // const newItemGroup = this.createTranslationGroup(tr, !this.isEditMode());
      const newItemGroup = this.createTranslationGroup(tr);
      translationsArray.push(newItemGroup);
    }

    return form;
  }

  private createTranslationGroup(tr: WordFormTranslation<WordTranslation>): WordTranslationForm {
    return this.fb.group({
      id: this.fb.control(tr.id),
      translText: this.fb.control(tr.translText, Validators.required),
      language: this.fb.control(tr.language ?? null),
      description: this.fb.control(tr.description ?? null),
      lexicalCategory: this.fb.control(tr.lexicalCategory ?? null),
      difficultyLevel: this.fb.control(tr.difficultyLevel ?? null),
    }) as WordTranslationForm;
  }

  focusFirstInvalidControl(form: FormGroup | FormArray): boolean {
    if (form instanceof FormGroup) {
      for (const key of Object.keys(form.controls)) {
        // console.log(key);
        const control = form.get(key);
        if (control && control.invalid) {
          if (control instanceof FormGroup || control instanceof FormArray) {
            const found = this.focusFirstInvalidControl(control);
            if (found) return true;
          } else {
            const el = document.querySelector(`[formcontrolname="${key}"]`) as HTMLElement;
            // console.log('ELEMENT', el);
            if (el) {
              el.focus();
              return true; //stop on first
            }
          }
        }
      }
    } else {
      for (let i = 0; i < form.controls.length; i++) {
        // console.log(i);
        const group = form.at(i) as FormGroup;
        if (group.invalid) {
          const found = this.focusFirstInvalidControl(group);
          if (found) return true;
        }
      }
    }

    return false;
  }
}
