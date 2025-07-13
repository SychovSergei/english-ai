import { WordTranslation } from '@entities/word/model/word.types';
import { WordFormFacade } from '@features/words/add-word-dialog/facade';
import {
  checkIsFormChanged,
  getChanges,
  removeFormGroupsWithEmptyValuesIn,
} from '@features/words/add-word-dialog/model/form.helpers';
import {
  WordFormBaseControls,
  WordFormTranslation,
  WordFormValue,
} from '@features/words/add-word-dialog/model/word-form.types';
import { OpenDialogWordData } from '@features/words/types';
import { CustomSpinnerDirective } from '@shared/directives/custom-spinner.directive';
import { ELangs, ELevels, ELexicalCategory } from '@shared/enums';
import { ApiErrorInterface } from '@shared/errors/error-types';
import { CustomHttpErrorResponse } from '@shared/interfaces';
// import { ApiErrorInterface } from '@shared/errors/error-types';
// import { CustomHttpErrorResponse } from '@shared/interfaces/error.interface';
import { INotificationService } from '@shared/services/notification/notification.interface';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/services/notification/notification-service.token';
import { DialogComponent } from '@shared/ui/dialog';
import { UiKitModule } from '@shared/ui/ui-kit';
import { addControlError, removeControlError } from '@shared/utils';

import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
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
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { WordUpdateOperationResult, WordUpdateTranslationOperationResult } from '@entities/word/api/word.api';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

type PropertyType<T, K extends keyof T> = T[K];

type IdType = PropertyType<WordFormValue, 'id'>;
type TextType = PropertyType<WordFormValue, 'text'>;
type LanguageType = PropertyType<WordFormValue, 'language'>;

type WordTranslationForm = FormGroup<{
  [K in keyof WordFormTranslation<WordTranslation>]: FormControl<WordFormTranslation<WordTranslation>[K] | null>;
}>;

type WordForm = FormGroup<{
  id: FormControl<IdType>;
  text: FormControl<TextType>;
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
  ],
  selector: 'app-add-word-dialog',
  templateUrl: './add-word-dialog.component.html',
  styleUrls: ['./add-word-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWordDialogComponent implements OnInit, OnDestroy {
  public isEditMode: WritableSignal<boolean> = signal(false);

  public isLoading: WritableSignal<boolean> = signal(false);
  public isWordLoading: WritableSignal<boolean> = signal(false);
  public isSubmitting: WritableSignal<boolean> = signal(false);
  public isButtonDisabled: WritableSignal<boolean> = signal(false);
  public isFormChanged: WritableSignal<boolean> = signal(false);

  private _destroy$ = new Subject<void>();
  private _isWordLoaded: boolean = false;
  private _loadedWord: string = '';
  private _isDataChangedSuccessful: boolean = false;
  private _translateDefaultLang: ELangs = ELangs.UA; // TODO - must load from config

  private fb = inject(FormBuilder);

  wordForm!: WordForm;

  get idCtrl(): FormControl<IdType> {
    return this.wordForm.get('id') as FormControl;
  }
  get textCtrl(): FormControl<TextType> {
    return this.wordForm.get('text') as FormControl;
  }
  get languageCtrl(): FormControl<LanguageType> {
    return this.wordForm.get('language') as FormControl;
  }
  get translationsCtrl(): FormArray {
    return this.wordForm.get('translations') as FormArray;
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
    text: '',
    language: ELangs.EN,
    translations: [
      {
        id: '',
        translText: '',
        description: '',
        lexicalCategory: ELexicalCategory.Empty,
        difficultyLevel: ELevels.Empty,
        language: ELangs.EN,
      },
    ],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private wordData: OpenDialogWordData,
    private dialogRef: MatDialogRef<AddWordDialogComponent>,
    @Inject(NOTIFICATION_SERVICE_TOKEN) private notificationService: INotificationService,
    // @Inject(WORD_SERVICE_TOKEN) private wordService: WordServiceInterface,
    private wordFormFacade: WordFormFacade,
  ) {
    const { data, mode } = this.wordData;
    const initVal = mode === 'edit' && data ? data : this.initialValues;

    this.wordForm = this.createForm(initVal);

    if (mode === 'edit') {
      this.isEditMode.set(true);
      this._loadedWord = data.text ?? '';
      this.updateBaseControls(data);
      // this.updateTranslationControls(data.translations, !this.isEditMode());
      this.updateTranslationControls(data.translations);
    }

    this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);
  }

  ngOnInit(): void {
    // this.resetFormState();
    this.listenToFormChanges();
    this.listenToTextControlChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private listenToFormChanges(): void {
    this.wordForm.valueChanges
      .pipe(
        debounceTime(1000), // Проверка изменений раз в 300 мс
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        // filter(() => this.isEditMode()),
        tap(() => {
          console.log(
            'getChanges',
            this.wordForm.getRawValue(),
            getChanges(this.wordForm.getRawValue() as WordFormValue, this.initialValues),
          );
        }),
        map(() => {
          return checkIsFormChanged<WordFormValue>(this.wordForm.getRawValue() as WordFormValue, this.initialValues);
        }),
        takeUntil(this._destroy$),
        tap((changed) => {
          console.log('wordForm changed:', changed);
          this.isFormChanged.set(changed);
        }),
      )
      .subscribe();
  }

  private listenToTextControlChanges(): void {
    this.textCtrl.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(500),
        distinctUntilChanged(), // ignore if value don't change
        map((val) => val?.toString().trim() as string),
        filter((val) => val !== this._loadedWord),
        filter((val) => val.length > 2),
        tap(() => this.isLoading.set(true)),
        switchMap((wordValue) =>
          this.wordFormFacade.checkIfWordExists(wordValue).pipe(
            tap(() => {
              this.isLoading.set(false);
            }),
            catchError((err) => {
              console.error('checkWord error', err);
              this.isLoading.set(false);
              return of(null);
            }),
          ),
        ),
      )
      .subscribe((res) => {
        this.isLoading.set(false);
        const alreadyExists = !!res?.id;

        if (alreadyExists) {
          /** if word exists in DB, and we are in CREATE MODE => set idCtrl  */
          if (!this._isWordLoaded && !this.isEditMode()) this.idCtrl.setValue(res.id ?? '', { emitEvent: false });

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
    if (this.wordForm.invalid) {
      this.wordForm.markAllAsTouched();
      this.wordForm.markAsDirty();
      this.focusFirstInvalidControl(this.wordForm);
      console.log('FORM INVALID => CANCEL');
      return;
    }

    this.isSubmitting.set(true);
    // const translations = this.mapTranslations();

    if (this.isEditMode() && this.idCtrl.value) {
      // const updateWordDto = this.toWordUpdateDTO(); //TODO надо в ФАСАД переместить
      // console.log('UPDATE data:', this.idCtrl.value, updateWordDto);
      this.wordFormFacade //TODO этот ли сервис или FACADE !!!!!!!!!!!!!!!!!!!!
        // .updateWord(this.idCtrl.value, updateWordDto)
        .updateWord(this.wordForm.getRawValue() as WordFormValue, this.initialValues)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res: WordUpdateOperationResult) => {
            console.log(res);
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
        });
    } else {
      /** CREATE mode (submit) */

      this.wordFormFacade
        .createWord(this.wordForm.getRawValue() as WordFormValue)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            console.log(res);
            console.log('res.id', res.id);
            this._loadedWord = res.text;

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
        });
    }
  }

  /** add translation to existing word */
  public addTranslationItem(translationControl: AbstractControl, index: number): void {
    const transData = translationControl.value as WordFormTranslation<WordTranslation>;
    if (this.idCtrl.value) {
      this.wordFormFacade
        .addTranslation(this.idCtrl.value, transData)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (translation: WordFormTranslation<WordTranslation>) => {
            this.updateTranslationControl(translation, index);
            this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);

            this._isDataChangedSuccessful = true;
            this.notificationService.showSuccess('Translation was added successful!');
          },
          error: (error: CustomHttpErrorResponse<ApiErrorInterface>) => {
            console.log(error.error);
            if (error.error.code === 'word-translation/already-exists') {
              this.notificationService.showError(error.error.message || 'Translation was not added! Try again.');
              this.translationsCtrl
                .at(index)
                .get('text')
                ?.setErrors({ translationError: { message: error.error.message } });
            }
          },
        });
    }
  }

  public removeTranslationItem(index: number): void {
    // this.isFormChanged.set(true);
    this.translationsCtrl.removeAt(index);
  }

  public loadWord(): void {
    if (!this.idCtrl.value || this.isEditMode()) return;
    this.isWordLoading.set(true);

    this.wordFormFacade
      .getWordById(this.idCtrl.value)
      .pipe(
        take(1),
        takeUntil(this._destroy$),
        tap(() => {
          this.isEditMode.set(true);
          this.isButtonDisabled.set(false);
        }),
      )
      .subscribe({
        next: (result: WordFormValue) => {
          this._isWordLoaded = true;
          if (!this._loadedWord) this._loadedWord = result.text;

          this.updateBaseControls(result);
          /** update error list for textControl */
          this.updateTextErrorList();

          /** remove empty Translate Input groups */
          removeFormGroupsWithEmptyValuesIn(this.translationsCtrl, 'translText');

          const translations: WordFormTranslation<WordTranslation>[] = result.translations;
          translations.forEach((translation: WordFormTranslation<WordTranslation>) => {
            this.addTranslationControls(translation);
          });
          const res: WordFormValue = { id: result.id, text: result.text, language: result.language, translations };
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
    language = this._translateDefaultLang,
    translText = '',
    description = '',
    lexicalCategory = ELexicalCategory.Empty,
    difficultyLevel = ELevels.Empty,
  }: Partial<WordFormTranslation<WordTranslation>> = {}): void {
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
    console.log(word);
    this.wordForm.patchValue(
      {
        id: word.id,
        text: word.text,
        language: word.language,
      },
      { emitEvent: false },
    );
  }

  private updateTranslationControl(transItem: WordFormTranslation<WordTranslation>, index: number): void {
    console.log(index, transItem);
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

  private updateTranslationCtrls({ translations }: WordUpdateTranslationOperationResult): void {
    for (const operationKey of Object.keys(translations)) {
      console.log(operationKey);
      switch (operationKey) {
        case 'created':
          console.log('translations.created', translations.created);
          for (const keyElement of translations.created) {
            console.log('keyElement', keyElement);
            if (keyElement.status === 'success') {
              const ctrl = this.translationsCtrl.controls.find(
                (ctrl) => ctrl.get('translText')?.value === keyElement.value?.text,
              );
              if (ctrl && keyElement) {
                ctrl.patchValue(
                  {
                    translText: keyElement.value?.text,
                    id: keyElement.value?.id,
                    language: keyElement.value?.language,
                    description: keyElement.value?.description,
                    lexicalCategory: keyElement.value?.lexicalCategory,
                    difficultyLevel: keyElement.value?.difficultyLevel,
                  },
                  { emitEvent: true },
                );
              }
              console.log('<><><>', ctrl?.getRawValue());
            }
          }
          break;
        case 'updated':
          console.log('translations.updated', translations.updated);
          break;
        case 'deleted':
          console.log('translations.deleted', translations.deleted);
          break;
        case 'skipped':
          console.log('translations.skipped', translations.skipped);

          for (const keyElement of translations.skipped) {
            console.log('keyElement', keyElement);
            if (keyElement.status === 'error') {
              const ctrl = this.translationsCtrl.controls.find(
                (ctrl) => ctrl.get('translText')?.value === keyElement.id && ctrl.get('id')?.value === '',
              );
              if (ctrl && keyElement) {
                ctrl.get('translText')?.setErrors({ alreadyExists: keyElement.reason!.message! || 'Already...' });
              }
              console.log('<><><>', ctrl?.getRawValue());
            }
          }

          break;
        default:
          console.log('------default-------');
          break;
      }
    }
  }

  private updateTextErrorList(): void {
    // TODO нужна ли?
    const errors = this.textCtrl.errors;
    if (errors) {
      delete errors['alreadyExists'];
      this.textCtrl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  }

  closeDialog(): void {
    console.log('closeDialog _isOperationSuccessful', this._isDataChangedSuccessful);
    this.dialogRef.close({ success: this._isDataChangedSuccessful }); // Передаем данные при закрытии
  }

  // showData(): void {
  //   console.log('this.wordForm.getRawValue():', this.wordForm.getRawValue());
  //   console.log('this.initialValues:', this.initialValues);
  //   console.log(
  //     this.wordFormFacade.buildWordPatchPayload(this.wordForm.getRawValue() as WordFormValue, this.initialValues),
  //   );
  // }

  private createForm(data: WordFormValue): WordForm {
    const form: WordForm = this.fb.group({
      id: this.fb.control(data.id, { nonNullable: true }),
      text: this.fb.control(data.text, {
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
        console.log(key);
        const control = form.get(key);
        if (control && control.invalid) {
          if (control instanceof FormGroup || control instanceof FormArray) {
            const found = this.focusFirstInvalidControl(control);
            if (found) return true;
          } else {
            const el = document.querySelector(`[formcontrolname="${key}"]`) as HTMLElement;
            console.log('ELEMENT', el);
            if (el) {
              el.focus();
              return true; //stop on first
            }
          }
        }
      }
    } else {
      for (let i = 0; i < form.controls.length; i++) {
        console.log(i);
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
