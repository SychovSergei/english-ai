import { JsonPipe, NgForOf, NgIf } from '@angular/common';
// import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
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
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';

import { ELangs } from '@shared/enums/langs.enum';
import { ELevels } from '@shared/enums/levels.enum';
import { ELexicalCategory } from '@shared/enums/lexical-categories.enum';
import {
  auditTime,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { ApiErrorInterface, CustomHttpErrorResponse } from '../../../../core/interfaces/error.interface';
// import { IWordService } from '../../interfaces--/word-service.interface';
import { WordUpdateTranslationDTO } from '../../../../core/interfaces/word-translation.interface';
import { ErrorService } from '../../../../core/services/error.service';
import { FormErrorMessageComponent } from '../../../../shared/components/form-error-message/form-error-message.component';
import { ErrorDisplayDirective } from '../../../../shared/directives/error-display.directive';
import { CreateWordDTO, UpdateWordDTO, WordTranslation } from '../../interfaces/word.interface';
import { WordService } from '../../services/word.service';
import { OpenDialogWordData } from '../words.component';

interface WordTranslationExtension extends WordTranslation {
  // isNew: FormControl<boolean | null>;
  isNew: boolean | null;
  id: string;
}
export type WordTranslationForm = {
  [K in keyof WordTranslationExtension]: FormControl<WordTranslationExtension[K] | null>;
}; //& { isNew: FormControl<boolean | false> };

@Component({
  selector: 'app-add-word',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    JsonPipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    MatDivider,
    MatCheckbox,
    ErrorDisplayDirective,
    FormErrorMessageComponent,
  ],
  templateUrl: './add-word.component.html',
  styleUrl: './add-word.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);

  private _translateDefaultLang: ELangs = ELangs.UA; // TODO - must load from config
  private translationsControl = this.fb.array<WordTranslationForm>([]);
  wordForm: FormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.min(2)]],
    translateAsDefault: true,
    language: [ELangs.EN], // TODO - must load from config
    // difficultyLevel: [ELevels.Empty],
    translateLanguageDefault: [this._translateDefaultLang], // TODO - must load from config
    translations: this.translationsControl,
  });

  readonly textControl = this.wordForm.controls['text'];
  readonly languageControl = this.wordForm.controls['language'];
  readonly translateAsDefaultControl = this.wordForm.controls['translateAsDefault'];
  // readonly difficultyLevelControl = this.wordForm.controls['difficultyLevel'];
  readonly translateLanguageDefaultControl = this.wordForm.controls['translateLanguageDefault'];
  isEditMode: boolean = false;
  isDuplicate: boolean = false;

  get translationItems() {
    return this.wordForm.get('translations') as FormArray;
  }

  get languageKeys() {
    console.log(Object.keys(ELangs));
    return Object.keys(ELangs);
  }

  private _langSelector: string[] | null = null;
  get languageValues() {
    // console.log(this._langSelector);
    if (!this._langSelector) return (this._langSelector = Object.values(ELangs));
    return this._langSelector;
  }

  private _levelSelector: string[] | null = null;
  get levelValues() {
    // console.log(this._levelSelector);
    if (!this._levelSelector) return (this._levelSelector = Object.values(ELevels));
    return this._levelSelector;
  }

  private _lexicalSelector: string[] | null = null;
  get lexicalValues() {
    // console.log(this._levelSelector);
    if (!this._lexicalSelector) return (this._lexicalSelector = Object.values(ELexicalCategory));
    return this._lexicalSelector;
  }

  // get translationLang(): ELangs {
  //   if (this.wordForm.get('translateAsDefault')?.value) {
  //     return this.wordForm.get('language')?.value || this._translateDefaultLang;
  //   }
  //   return this._translateDefaultLang;
  // }

  // private _snackBar = inject(MatSnackBar);

  wordId: string | undefined = undefined; //TODO must be private
  currentWord: string = ''; //TODO must be private
  isLoading: boolean = false;
  get isUpdate(): boolean {
    return Boolean(this.wordId) && this.isEditMode;
  }

  get isDisabled(): boolean {
    return this.isDuplicate;
  }

  get isTextChanged(): boolean {
    return this.currentWord !== this.textControl.value.toString().trim();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initialValues: any = {}; // Сохраним начальные значения
  saveInitialValues() {
    this.initialValues = this.wordForm.getRawValue(); // Запоминаем исходное состояние
    console.log('this.initialValues', this.initialValues);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isFormChanged(formGroup: FormGroup = this.wordForm, initialValues: any = this.initialValues): boolean {
    return Object.keys(formGroup.controls).some((key) => {
      const control = formGroup.controls[key];

      if (control instanceof FormGroup) {
        return this.isFormChanged(control, initialValues[key]); // Рекурсивно проверяем FormGroup
      }
      if (control instanceof FormArray) {
        return control.controls.some((fg, i) => this.isFormChanged(fg as FormGroup, initialValues[key]?.[i])); // Проверяем FormArray
      }

      return control.value !== initialValues[key]; // Проверяем изменение значения
    });
  }

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private dialogRef: MatDialogRef<AddWordComponent, any>,
    // @Inject(MAT_DIALOG_DATA) public data: { data: Word; mode: WordActionMode } | null,
    @Inject(MAT_DIALOG_DATA) public data: OpenDialogWordData,
    // @Inject(WORD_SERVICE_TOKEN) private wordService: IWordService,
    private wordService: WordService,
    private errorService: ErrorService,
    private cdr: ChangeDetectorRef,
  ) {
    console.log(this.data);
    this.wordId = data?.data?.id?.toString();
  }

  formChanged: boolean = false;
  ngOnInit() {
    this.formChanged = false;

    this.wordForm.markAsPristine();
    console.log('FORM ngOnInit');
    console.log('FORM ngOnInit data', this.data);

    if (this.data) {
      const { data, mode } = this.data;
      console.log('FORM ngOnInit mode', mode);
      if (mode === 'edit') this.isEditMode = true;

      this.textControl.setValue(data.text || '', { emitEvent: false });
      this.languageControl.setValue(data.language || ELangs.EN, { emitEvent: false });
      data.translations.forEach((trans) => {
        const { id, text, language, description, lexicalCategory, difficultyLevel } = trans;

        this.addItem({
          id: id?.toString() || '',
          isNew: false,
          text,
          description,
          language,
          lexicalCategory,
          difficultyLevel,
        });
      });

      this.saveInitialValues(); // Запоминаем начальные значения

      this.wordForm.valueChanges
        .pipe(
          auditTime(100), // Проверка изменений раз в 100 мс
        )
        .subscribe(() => {
          this.formChanged = this.isFormChanged();
        });
    } else {
      // this.addItem();
      console.log('data is empty');
    }

    this.resetFormState();

    this.textControl.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(), // Игнорировать, если значение не изменилось
        tap(() => (this.isLoading = true)),
        map((val) => val.toString().trim() as string),
        filter((val) => val.length > 2), // Отправляем запрос только если длина текста больше 2
        tap((val) => console.log('Input value: ', `'${val}'`)), // Проверяем, эмитируются ли новые значения
        // filter(() => !this.isEditMode),
        tap((val) => {
          this.currentWord = val;
          console.log(this.currentWord);
        }),
        switchMap((wordValue) =>
          this.wordService.checkWord(wordValue).pipe(
            tap(() => {
              console.log('проверка слова пришла');
              this.isLoading = false;
            }),
            catchError((err: CustomHttpErrorResponse<ApiErrorInterface<{ id: string | null }>>) => {
              if (err.error.status === 409 && err.error.code === 'word/already-exists') {
                this.isLoading = false;
                this.wordId = err.error.body?.id || undefined;
                this.textControl.setErrors({ alreadyExists: true });
                this.errorService.handleError(err, this.wordForm);
                this.isDuplicate = true;
                this.markControlsAsTouched(this.wordForm);
                return of(null); // Возвращаем Observable с null, чтобы поток не завершался
              }
              throw err;
            }),
          ),
        ),
        tap((result) => {
          this.isLoading = false; // Завершение загрузки после успешного результата
          console.log('Запрос завершён, результат: ', result);
        }),
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.isDuplicate = false;
          this.isLoading = false;

          if (res) {
            this.wordId = res.id;
            this.cdr.markForCheck();
            // this.textControl.setErrors({ alreadyExists: true });
            // this.isDuplicate = true;
            // this.markControlsAsTouched(this.wordForm);
          }
        },
        error: (err: CustomHttpErrorResponse<ApiErrorInterface>) => {
          // error: (err: CustomHttpErrorResponse<{ id: string }>) => {
          console.log(err);
          this.isLoading = false;
          // this.isLoading = false;
          // if (err.status === 404) {
          //   this.isDuplicate = false;
          //   // this.textControl.reset(this.currentWord);
          //   // this.textControl.setValue(this.currentWord, { emitEvent: false });
          // }
          // this.errorService.handleError(err, this.wordForm);
          // this.markControlsAsTouched(this.wordForm);
        },
        complete: () => {
          this.isLoading = false;
        },
      });

    merge(this.languageControl.valueChanges, this.translateAsDefaultControl.valueChanges)
      // .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        console.log(value);
        this.onUpdateTranslationLangs(value);
      });
    // TODO - update default languages in form
    // this.translateLanguageDefault.valueChanges.subscribe((val) => {
    //   console.log(val);
    //   if (val && !!this.translateAsDefault.value) this.onUpdateTranslationLangs(val);
    // });
    // this.translateAsDefault.valueChanges.subscribe(() => {
    //   const lang = this.translateLanguageDefault.value;
    //   if (lang) this.onUpdateTranslationLangs(lang);
    // });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetFormState() {
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

  private onUpdateTranslationLangs(value: unknown) {
    if (typeof value === 'boolean') {
      console.log(value);
      const lang = this.translateLanguageDefaultControl.value;
      if (lang) this.onUpdateTranslationLangs(lang);
    } else if (
      typeof value === 'string' &&
      Object.values(ELangs)
        .map((val) => val.toString())
        .includes(value)
    ) {
      console.log('value', value);
      // this._translateDefaultLang = val;
      console.log(this._translateDefaultLang);
      this.updateTranslationLangs(value as ELangs);
    }
  }

  private updateTranslationLangs(lang: ELangs) {
    this.translationItems.controls.forEach((group) => {
      group.get('language')?.setValue(lang);
    });
  }

  removeItem(index: number) {
    this.translationsControl.removeAt(index);
  }

  onSubmit() {
    console.log('this.isUpdate', this.isUpdate);
    console.log('wordId isEditMode', this.wordId, this.isEditMode);
    this.isLoading = true;

    const translations: WordUpdateTranslationDTO[] = this.translationItems.controls.map<WordUpdateTranslationDTO>(
      (translation) => {
        return {
          id: translation.get('id')?.value,
          text: translation.get('text')?.value.toString().trim(),
          language: translation.get('language')?.value,
          description: translation.get('description')?.value,
          difficultyLevel: translation.get('difficultyLevel')?.value,
          lexicalCategory: translation.get('lexicalCategory')?.value,
        };
      },
    );

    const updateWordDTO: UpdateWordDTO = {
      id: this.wordId,
      text: this.textControl.value.toString().trim(),
      translations: translations,
    };
    console.log(updateWordDTO);
    // this.data?.mode! ||
    // this.isEditMode ? 'edit' : 'create'
    this.wordService.processWord(this.data.mode || 'create', updateWordDTO);
  }

  /** >>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  onSubmit2() {
    /** if word already exists */
    console.log('this.isUpdate', this.isUpdate);
    console.log('wordId isEditMode', this.wordId, this.isEditMode);
    if (this.isUpdate) {
      console.log('REQUEST UPDATE data', this.wordForm.value);
      if (this.wordId) {
        // TODO Сделать DTO объект для передачи на обновление
        const translations: WordUpdateTranslationDTO[] = this.translationItems.controls.map<WordUpdateTranslationDTO>(
          (translation) => {
            return {
              id: translation.get('id')?.value,
              text: translation.get('text')?.value.toString().trim(),
              language: translation.get('language')?.value,
              description: translation.get('description')?.value,
              difficultyLevel: translation.get('difficultyLevel')?.value,
              lexicalCategory: translation.get('lexicalCategory')?.value,
            };
          },
        );
        const updateObjDTO: UpdateWordDTO = {
          id: this.wordId,
          text: this.textControl.value.toString().trim(),
          translations: translations,
        };

        this.isLoading = true;
        this.wordService.updateWord(this.wordId, updateObjDTO).subscribe({
          next: () => {
            this.isLoading = false;
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.log(error);
            this.isLoading = false;
          },
        });
      }
    } else {
      /** if CREATE mode */
      if (!this.isEditMode) {
        this.isLoading = true;
        console.log('REQUEST data', this.wordForm.value);
        const translations = this.translationItems.controls.map<WordTranslation>((translation) => {
          return {
            text: translation.get('text')?.value.toString().trim(),
            language: translation.get('language')?.value,
            description: translation.get('description')?.value,
            difficultyLevel: translation.get('difficultyLevel')?.value,
            lexicalCategory: translation.get('lexicalCategory')?.value,
          };
        });
        const createWordObj: CreateWordDTO = {
          text: this.textControl.value.toString().trim(),
          language: this.languageControl.value,
          sentences: [],
          relatedForms: [],
          translations: translations,
        };
        console.log(createWordObj);

        this.textControl.setValue(this.textControl.value.toString().trim(), { emitEvent: false });
        this.currentWord = this.textControl.value.toString();

        this.wordService.createWord(createWordObj).subscribe({
          next: (res) => {
            this.isLoading = false;
            console.log(res);
            // this._snackBar.openFromComponent(SnackBarComponent, {
            //   duration: 10000,
            //   data: { message: 'Слово успешно добавлено!' },
            // });
            this.dialogRef.close(true);
          },
          error: (err: CustomHttpErrorResponse<ApiErrorInterface<{ id: string }>>) => {
            // error: (err: CustomHttpErrorResponse<{ id: string }>) => {
            this.isLoading = false;
            console.log(err.error.body);
            if (err.status === 409 && err.error.code === 'word/already-exists' && err.error.body) {
              this.wordId = err.error.body.id;
              this.isDuplicate = true;

              console.log('ERRRRRROOOOOORRRR error ===', err.error);
              console.log('ERRRRRROOOOOORRRR body ===', err.error.body);
              console.log('ERRRRRROOOOOORRRR wordID ===', this.wordId);
              this.textControl.setErrors({ alreadyExists: true });
            }
            this.errorService.handleError(err, this.wordForm);
            this.markControlsAsTouched(this.wordForm);
          },
        });
      }
    }
  }
  /** <<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  // Рекурсивная функция для обхода всех контролов и назначения им статуса markAsTouched
  // markControlsAsTouched(control: FormControl | FormGroup | FormArray) {
  /** определить все инпуты формы как touched */
  markControlsAsTouched(control: AbstractControl) {
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

  addItem(
    { language, text, description, id, isNew, difficultyLevel, lexicalCategory }: WordTranslationExtension = {
      id: '',
      isNew: true,
      language: this._translateDefaultLang,
      text: '',
      description: '',
      lexicalCategory: ELexicalCategory.Empty,
      difficultyLevel: ELevels.Empty,
    },
  ) {
    const newItem: FormGroup<WordTranslationForm> = this.fb.group({
      id: [id],
      isNew: [isNew || false],
      language: [language || this._translateDefaultLang],
      text: [text || '', Validators.required],
      description: [description || ''],
      lexicalCategory: [lexicalCategory || ELexicalCategory.Empty],
      difficultyLevel: [difficultyLevel || ELevels.Empty],
    });
    this.translationItems.push(newItem);

    // Обновляем значения без уведомления формы
    newItem.setValue(
      {
        id: id || '',
        isNew: isNew ?? true,
        language: language || this._translateDefaultLang,
        text: text || '',
        description: description || '',
        lexicalCategory: lexicalCategory || ELexicalCategory.Empty,
        difficultyLevel: difficultyLevel || ELevels.Empty,
      },
      { emitEvent: false }, // <-- Скрываем изменения от формы
    );
  }

  loadTranslations() {
    console.log('loadTranslations', this.textControl.value, this.wordId);
    if (this.wordId) {
      // this.wordService.getWord(this.text.value.trim()).subscribe((result) => {
      this.isLoading = true;
      this.wordService
        .getWord(this.wordId)
        .pipe(take(1))
        .subscribe({
          next: (result) => {
            this.isEditMode = true;
            this.isDuplicate = false;
            const errors = this.textControl.errors;
            if (errors) {
              delete errors['alreadyExists'];
              this.textControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
            }
            // this.textControl.disable();
            // this.languageControl.disable();

            // if (this.textControl.value === '') {
            // console.log('EMPTY');
            // console.log(this.translationsControl.getRawValue());
            // this.translationItems.controls.forEach<WordTranslation>(() => {});
            // }
            const length: number = this.translationsControl.getRawValue().length;
            const arrayForRemove: number[] = [];
            for (let i = 0; i < length; i++) {
              // console.log('length=', length);
              const group = this.translationItems.controls.at(i) as FormGroup;
              // console.log('text', i, group.controls['text'].value.toString());
              if (group.controls['text'].value.toString().trim() === '') {
                arrayForRemove.push(i);
                // this.translationItems.removeAt(i);
              }
            }
            // const ddd = arrayForRemove.length;
            // console.log(arrayForRemove);
            for (let i = length - 1; i >= 0; i--) {
              // console.log(ddd, i, arrayForRemove.includes(i));
              if (arrayForRemove.includes(i)) {
                this.translationItems.removeAt(i);
                // console.log('удаляю', i);
              }
            }

            console.log(result);
            result.translations.forEach((translation) => {
              const { language, text, description, id } = translation;
              console.log(id);
              // this.translationItems.push(
              //   this.fb.group({
              //     language: [language || this._translateDefaultLang],
              //     text: [text || '', [Validators.required]],
              //     description: [description || ''],
              //     // _id: [_id || null], // Сохраняем _id
              //     isNew: [false], // Помечаем, что это данные с сервера
              //   }),
              // );
              this.addItem({
                id: id?.toString() || '',
                isNew: false,
                text,
                language,
                description,
                lexicalCategory: ELexicalCategory.Empty,
                difficultyLevel: ELevels.Empty,
              });
            });
            this.cdr.markForCheck();
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    }
  }

  //// eslint-disable-next-line @typescript-eslint/no-explicit-any WordTranslation
  updateWordTranslation(transDataControl: AbstractControl) {
    const transData = transDataControl.value;
    console.log('updateWordTranslation', transData);
    const newTranslation: WordTranslation = {
      id: '',
      text: transData.text,
      language: transData.language,
      description: transData.description,
      lexicalCategory: transData.lexicalCategory,
      difficultyLevel: transData.difficultyLevel,
    };

    if (this.wordId) {
      this.wordService.addTranslation(this.wordId, newTranslation).subscribe({
        next: (res) => {
          console.log(res);
          transDataControl.get('isNew')?.setValue(false);
          this.cdr.markForCheck();
        },
        //// eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (error: CustomHttpErrorResponse<ApiErrorInterface>) => {
          console.log(error.error);
          if (error.error.code === 'word/translation') {
            transDataControl.get('text')?.setErrors({ translationError: { message: error.error.message } });
          }
        },
      });
    }
  }
}
