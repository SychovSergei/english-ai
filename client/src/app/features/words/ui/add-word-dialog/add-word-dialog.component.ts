import { Word, WordTranslationItemDTO } from '@entities/word';
import { CreateWordDTO, UpdateWordDTO, WordTranslation } from '@entities/word/model/word.model';
import { WORD_SERVICE_TOKEN } from '@features/words/model/word.tokens';
import { OpenDialogWordData, WordServiceInterface } from '@features/words/types';
import { WordTranslationExtension } from '@features/words/ui/add-word-dialog/interfaces/word-translation-extension.interface';
import { ELangs, ELevels, ELexicalCategory } from '@shared/enums';
import { ApiErrorInterface } from '@shared/errors/error-types';
import { CustomHttpErrorResponse } from '@shared/interfaces/error.interface';
import { INotificationService } from '@shared/services/notification/notification.interface';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/services/notification/notification-service.token';
import { DialogComponent } from '@shared/ui/dialog';
import { UiKitModule } from '@shared/ui/ui-kit';

import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
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
  auditTime,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

interface WordFormValue {
  text: string | null;
  language: ELangs | null;
  translations: WordTranslation[];
}

type PropertyType<T, K extends keyof T> = T[K];

type TextType = PropertyType<WordFormValue, 'text'>;
type LanguageType = PropertyType<WordFormValue, 'language'>;

type WordTranslationForm = FormGroup<{
  [K in keyof WordTranslationExtension]: FormControl<WordTranslationExtension[K] | null>;
}>;

interface WordForm {
  text: FormControl<TextType>;
  language: FormControl<LanguageType>;
  translations: FormArray<WordTranslationForm>; // FormArray содержит FormControls или FormGroups
}

@Component({
  imports: [MatDialogModule, DialogComponent, UiKitModule, NgForOf, NgIf, ReactiveFormsModule, JsonPipe],
  selector: 'app-add-word-dialog',
  templateUrl: './add-word-dialog.component.html',
  styleUrls: ['./add-word-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWordDialogComponent implements OnInit, OnDestroy {
  public title: string = 'Create word';
  public isEditMode: WritableSignal<boolean> = signal(false);

  public isLoading: WritableSignal<boolean> = signal(false);
  public isButtonDisabled: WritableSignal<boolean> = signal(false);
  public isFormChanged: WritableSignal<boolean> = signal(false);

  private wordId: string = '';
  private _destroy$ = new Subject<void>();
  private _isWordLoaded: boolean = false;
  private _isOperationSuccessful: boolean = false;
  private _translateDefaultLang: ELangs = ELangs.UA; // TODO - must load from config

  private fb = inject(FormBuilder);

  private translationsControl = this.fb.array<WordTranslationForm>([]);
  wordForm: FormGroup<WordForm> = this.fb.group({
    text: ['', [Validators.required, Validators.min(2)]],
    language: [ELangs.EN], // TODO - must load from config
    translations: this.translationsControl,
  });
  readonly textControl = this.wordForm.controls['text'];
  readonly languageControl = this.wordForm.controls['language'];

  get translationItems(): FormArray {
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
    text: '',
    language: ELangs.EN,
    translations: [
      {
        id: '',
        text: '',
        description: '',
        lexicalCategory: ELexicalCategory.Empty,
        difficultyLevel: ELevels.Empty,
        language: ELangs.EN,
      },
    ],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: OpenDialogWordData,
    private dialogRef: MatDialogRef<AddWordDialogComponent>,
    @Inject(NOTIFICATION_SERVICE_TOKEN) private notificationService: INotificationService,
    @Inject(WORD_SERVICE_TOKEN) private wordService: WordServiceInterface,
  ) {
    this.wordId = data.data.id;

    effect(
      () => {
        const { data, mode } = this.data;
        if (mode === 'edit') {
          this.isEditMode.set(true);
        }
        this.wordId = data.id;
        this.title = 'Update mode';

        this.textControl.setValue(data.text, { emitEvent: false });
        this.languageControl.setValue(data.language, { emitEvent: false });
        for (const translation of data.translations) {
          const { id, text, language, description, lexicalCategory, difficultyLevel } = translation;
          this.addItem({
            id,
            isNew: false,
            text,
            description,
            language,
            lexicalCategory,
            difficultyLevel,
          });
        }
        // data.translations.forEach((translation) => {
        //
        // });

        this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);
      },
      { allowSignalWrites: true },
    );

    this.wordForm.valueChanges
      .pipe(
        auditTime(200), // Проверка изменений раз в 100 мс
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.isFormChanged.set(this.checkIsFormChanged());
      });
  }

  ngOnInit(): void {
    this.resetFormState();

    this.textControl.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(2000),
        distinctUntilChanged(), // ignore if value don't change
        filter(() => !this._isWordLoaded),
        tap(() => {
          this.isLoading.set(true);
        }),
        map((val) => val?.toString().trim() as string),
        filter((val) => val.length > 2), // Отправляем запрос только если длина текста больше 2
        // tap((val) => console.log('Input value: ', `'${val}'`)), // Проверяем, эмитируются ли новые значения

        switchMap((wordValue) =>
          this.wordService.checkWord(wordValue).pipe(
            takeUntil(this._destroy$),
            tap(() => {
              this.isLoading.set(false);
            }),
            // catchError((err: CustomHttpErrorResponse<ApiErrorInterface<IWordErrorBodyAlreadyExists>>) => {
            //   if (err.error.status === 409 && err.error.code === 'word/already-exists') {
            //     console.log('ERRROOOORRRRR >>>>>> 409');
            //     this.isLoading.set(false);
            //     this.wordId = err.error.body?.id || '';
            //     console.log(this.wordId, this.wordId, this.wordId, this.wordId);
            //     this.textControl.setErrors({ alreadyExists: true });
            //
            //     this.notificationService.showError('This word already exists!!!');
            //     // this.errorService.handleError(err, this.wordForm);
            //
            //     this.isButtonDisabled.set(true);
            //     this.markControlsAsTouched(this.wordForm);
            //     return of(null); // Возвращаем Observable с null, чтобы поток не завершался
            //   }
            //   throw err;
            // }),
          ),
        ),
      )
      .subscribe({
        next: (res) => {
          this.isButtonDisabled.set(false);
          this.isLoading.set(false);

          if (res?.id) {
            /** if word exists */
            if (!this._isWordLoaded && !this.isEditMode()) this.wordId = res.id;
            this.textControl.setErrors({ alreadyExists: true });
            this.notificationService.showError('This word already exists!!!');
            this.isButtonDisabled.set(true);
            this.markControlsAsTouched(this.wordForm);
          } else {
            /** if word doesn't exists */
            if (!this.isEditMode()) this.wordId = '';
          }
        },
        error: (err: CustomHttpErrorResponse<ApiErrorInterface>) => {
          console.log(err);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });

    // , this.translateAsDefaultControl.valueChanges

    // merge(this.languageControl.valueChanges)
    //   // .pipe(takeUntilDestroyed())
    //   .subscribe((value) => {
    //     console.log(value);
    //     this.onUpdateTranslationLangs(value);
    //   });
    // TODO - update default languages in form
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSubmit(): void {
    this.isLoading.set(true);
    // const translations = this.mapTranslations();

    if (this.isEditMode()) {
      const updateWordDto = this.toWordUpdateDTO();
      this.wordService //TODO этот ли сервис или фасад?
        .updateWord(this.wordId, updateWordDto)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res: Word) => {
            this.notificationService.showSuccess('Word was UPDATED successful!');

            this.updateFormMainData({
              text: res.text,
              language: res.language,
              translations: [],
            } as WordFormValue);
            this.updateFormTranslationsItems(res.translations);
            this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);

            this.isFormChanged.set(this.checkIsFormChanged());
          },
          error: (err) => {
            console.log(err);
            this.isLoading.set(false);
            this.notificationService.showError('Something went wrong... UPDATE');
          },
          complete: () => {
            this.isLoading.set(false);
            this._isOperationSuccessful = true;
          },
        });
    } else {
      /** CREATE mode (submit) */
      const createWordDto = this.toWordCreateDTO();

      this.wordService
        .createWord(createWordDto)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            console.log(res);
            this.isLoading.set(false);
            this.notificationService.showSuccess('Word was created successful!');
            this.data.mode = 'edit';
            this.wordId = res.id;

            this.updateFormMainData({
              text: res.text,
              language: res.language,
              translations: [],
            } as WordFormValue);

            this.updateFormTranslationsItems(res.translations);
            this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);
            this.isEditMode.set(true);
            // this.title.set('Update mode');
          },
          error: (err) => {
            console.log(err);
            this.isLoading.set(false);
            this.notificationService.showError('Something went wrong...');
          },
          complete: () => {
            this.isLoading.set(false);
            this._isOperationSuccessful = true;
          },
        });
    }
  }

  // add translation to existing word
  public addTranslationItem(transDataControl: AbstractControl): void {
    const newTranslationDto: WordTranslationItemDTO = new WordTranslationItemDTO();
    // const transData = transDataControl.value;
    // const newTranslation: WordTranslation = {
    //   id: '',
    //   text: transData.text,
    //   language: transData.language,
    //   description: transData.description,
    //   lexicalCategory: transData.lexicalCategory,
    //   difficultyLevel: transData.difficultyLevel,
    // };

    if (this.wordId) {
      this.wordService
        .addTranslation(this.wordId, newTranslationDto)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (res) => {
            this.notificationService.showSuccess('Translation was added successful!');

            this.updateFormMainData({
              text: res.text,
              language: res.language,
              translations: [],
            } as WordFormValue);
            this.updateFormTranslationsItems(res.translations);
            this.memorizeInitialValues(this.wordForm.getRawValue() as WordFormValue);

            this.isFormChanged.set(this.checkIsFormChanged());
            this._isOperationSuccessful = true;
          },
          error: (error: CustomHttpErrorResponse<ApiErrorInterface>) => {
            console.log(error.error);
            this.notificationService.showError('Translation was not added! Try again.');
            if (error.error.code === 'word/translation') {
              transDataControl.get('text')?.setErrors({ translationError: { message: error.error.message } });
            }
          },
        });
    }
  }

  public removeTranslationItem(index: number): void {
    this.isFormChanged.set(true);
    this.translationsControl.removeAt(index);
  }

  public loadWord(): void {
    if (this.wordId && !this.isEditMode()) {
      this.isLoading.set(true);
      this.wordService
        .getWord(this.wordId)
        .pipe(
          take(1),
          tap(() => {
            this.isEditMode.set(true);
            this.isButtonDisabled.set(false);
          }),
        )
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (result) => {
            /** update error list for textControl */
            this.updateTextErrorList();

            /** remove empty Translate Input groups */
            this.removeEmptyTranslationGroups();

            result.translations.forEach((translation: WordTranslation) => {
              this.addItem({
                ...translation,
                isNew: false,
              });
            });

            this.memorizeInitialValues(result);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
    }
  }

  public addItem(
    { language, text, description, id, isNew, difficultyLevel, lexicalCategory }: WordTranslationExtension = {
      id: '',
      isNew: true,
      language: this._translateDefaultLang,
      text: '',
      description: '',
      lexicalCategory: ELexicalCategory.Empty,
      difficultyLevel: ELevels.Empty,
    },
  ): void {
    const newItemGroup = this.fb.group({
      id: [id || ''],
      isNew: [isNew || false],
      language: [language || this._translateDefaultLang],
      text: [text || '', Validators.required],
      description: [description || ''],
      lexicalCategory: [lexicalCategory || ELexicalCategory.Empty],
      difficultyLevel: [difficultyLevel || ELevels.Empty],
    });
    this.translationItems.push(newItemGroup);

    // update form new translation item
    newItemGroup.setValue(
      {
        id: id || '',
        isNew: isNew, // ?? true,
        language: language || this._translateDefaultLang,
        text: text || '',
        description: description || '',
        lexicalCategory: lexicalCategory || ELexicalCategory.Empty,
        difficultyLevel: difficultyLevel || ELevels.Empty,
      },
      { emitEvent: false },
    );
  }

  private resetFormState(): void {
    this.wordForm.markAsPristine();
    this.wordForm.markAsUntouched();

    // Для всех элементов FormArray
    this.translationItems.controls.forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
      console.log(control.pristine.toString());
    });

    this.wordForm.updateValueAndValidity({ emitEvent: false });
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

  private memorizeInitialValues(word: WordFormValue = this.wordForm.getRawValue() as WordFormValue): void {
    this.initialValues = word;
  }

  private checkIsFormChanged(
    formGroup: FormGroup = this.wordForm,
    initialValues: WordFormValue = this.initialValues,
  ): boolean {
    return Object.keys(formGroup.controls).some((key) => {
      const control = formGroup.controls[key];

      const initialValue = initialValues[key as keyof WordFormValue];

      if (initialValue == null) {
        return false;
      }

      // Проверка для FormGroup (рекурсивно)
      if (control instanceof FormGroup) {
        return this.checkIsFormChanged(control, initialValue as unknown as WordFormValue);
      }

      // Для FormArray
      if (control instanceof FormArray) {
        // Здесь мы работаем с типом WordTranslationForm[]
        const typedInitialValue = initialValue as unknown as WordTranslation[];

        //check changing array length
        if (control.controls.length !== typedInitialValue.length)
          return control.controls.length !== typedInitialValue.length;

        return control.controls.some((fg, i) => {
          const formGroup = fg as FormGroup;
          // Мы проверяем изменения внутри массива, используя правильный тип
          return this.checkIsFormChanged(formGroup, typedInitialValue[i] as unknown as WordFormValue);
        });
      }

      return initialValue !== control.value;
    });
  }

  private updateFormMainData(wordFormValue: WordFormValue): void {
    const { text, language } = wordFormValue;
    this.wordForm.patchValue(
      {
        text: text,
        language: language,
      },
      { emitEvent: false },
    );
  }

  private updateFormTranslationsItems(translations: WordTranslation[]): void {
    this.translationsControl.controls.forEach((control: AbstractControl, index) => {
      if (control instanceof FormGroup) {
        control.patchValue({ ...translations[index], isNew: false }, { emitEvent: false });
      }
    });
  }

  private updateTextErrorList(): void {
    const errors = this.textControl.errors;
    if (errors) {
      delete errors['alreadyExists'];
      this.textControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  }

  private removeEmptyTranslationGroups(): void {
    const length: number = this.translationsControl.getRawValue().length;
    const arrayForRemove: number[] = [];
    for (let i = 0; i < length; i++) {
      const group = this.translationItems.controls.at(i) as FormGroup;
      if (group.controls['text'].value.toString().trim() === '') {
        arrayForRemove.push(i);
      }
    }
    for (let i = length - 1; i >= 0; i--) {
      if (arrayForRemove.includes(i)) {
        this.translationItems.removeAt(i);
      }
    }
  }

  private _mapTranslations(): WordTranslation[] {
    return this.translationItems.controls.map<WordTranslation>((translation) => {
      return {
        id: translation.get('id')?.value,
        text: translation.get('text')?.value.toString().trim(),
        language: translation.get('language')?.value,
        description: translation.get('description')?.value,
        difficultyLevel: translation.get('difficultyLevel')?.value,
        lexicalCategory: translation.get('lexicalCategory')?.value,
      };
    });
  }

  private toWordCreateDTO(): CreateWordDTO {
    const translations = this._mapTranslations();
    return {
      text: this.textControl.value?.toString().trim() || '',
      language: this.languageControl.value || ELangs.EN,
      translations: translations,
    };
  }

  private toWordUpdateDTO(): UpdateWordDTO {
    const translations = this._mapTranslations();
    return {
      id: this.wordId,
      text: this.textControl.value!.toString().trim(),
      translations: translations,
    };
  }

  closeDialog(): void {
    console.log('closeDialog _isOperationSuccessful', this._isOperationSuccessful);
    this.dialogRef.close({ success: this._isOperationSuccessful }); // Передаем данные при закрытии
  }
}
