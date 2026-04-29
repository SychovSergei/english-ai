import { WordItemIsNew } from '@entities/word-set';
import { FloatButtonModule } from '@shared/directives/add-floating-button';
import { generateCompactId } from '@shared/lib';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { UiKitModule } from '@shared/ui/ui-kit';

import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { NgForOf } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';

interface WordItemControl {
  id: FormControl<string | null>;
  term: FormControl<string | null>;
  definition: FormControl<string | null>;
  isNew: FormControl<boolean | null>;
}

@Component({
  selector: 'app-word-list-form',
  templateUrl: './word-list-form.component.html',
  styleUrls: ['./word-list-form.component.scss'],
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    FormsModule,
    UiKitModule,
    ReactiveFormsModule,
    NgForOf,

    FloatButtonModule,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class WordListFormComponent implements OnInit {
  private readonly loggerService = inject(LoggerService).createLogger('WordListFormComponent');

  @Input({ required: true }) public controlKey!: string;
  @Input({ required: true }) public listDataWords$!: Observable<WordItemIsNew[]>;
  @Output() termChange: EventEmitter<string> = new EventEmitter();

  public get parentFormGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  public get wordGroup(): FormArray<FormGroup<WordItemControl>> {
    return this.parentFormGroup.get(this.controlKey) as FormArray; //?.get(this.formArrayName) as FormGroup; //FormArray;
  }

  constructor(
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private controlContainer: ControlContainer,
  ) {}

  ngOnInit(): void {
    this.initWordControl();

    this.listDataWords$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((words) => {
      // console.log('initialWords$', words);
      this.initWordControlsFromList(words);
    });
  }

  /** Get name from input field and add control to the parent Form Container
   *
   * @private
   */
  private initWordControl(): void {
    // const arr = new FormArray<FormGroup<WordItemControl>>([]);
    const arr = this.fb.array<FormGroup<WordItemControl>>([], { updateOn: 'change' });

    if (!this.parentFormGroup.contains(this.controlKey)) {
      this.parentFormGroup.addControl(this.controlKey, arr);
    } else {
      this.loggerService.log('КОНТРОЛ words УЖЕ ЕСТЬ');
      // this.wordGroup.
    }
  }

  /** Add controls from array
   *
   * @param words
   * @private
   */
  private initWordControlsFromList(words: WordItemIsNew[]): void {
    for (const word of words) {
      this.addWordControl(word);
    }
  }

  /** Create control item and add it to FormArray control
   *
   * @param data
   */
  public addWordControl(data?: Partial<WordItemIsNew>): void {
    const newGroup = this.createWordGroup({
      id: data?.id ?? generateCompactId(),
      term: data?.term ?? '',
      definition: data?.definition ?? '',
      isNew: data?.isNew ?? true,
    });

    newGroup.controls['term'].valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((val) => {
      this.loggerService.log('val', val);
      if (val?.trim()) this.termChange.emit(val);
    });

    if (this.wordGroup) this.wordGroup.push(newGroup, { emitEvent: false });

    // Отключаем валидацию для новых элементов
    // newGroup.updateValueAndValidity({ onlySelf: true });

    this.resetState();
  }

  resetState(): void {
    // Форсируем обновление изменений в Angular
    this.cdr.detectChanges();
    // Для всех элементов FormArray
    this.wordGroup.controls.forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
      control.get('term')?.markAsUntouched();
      control.get('term')?.markAsPending();
      control.get('term')?.markAsPristine();
      control.get('definition')?.markAsUntouched();
      control.get('definition')?.markAsPending();
      control.get('definition')?.markAsPristine();
    });
    // this.wordGroup.markAsUntouched();
    // this.wordGroup.markAsPristine();

    // Если нужно, можно вызвать `updateValueAndValidity` для всей формы{ onlySelf: true }
    // this.wordGroup.updateValueAndValidity();
  }

  public removeCardByIndex(i: number): void {
    this.wordGroup.removeAt(i);
    this.resetState();
  }

  public trackById(index: number, item: AbstractControl): string {
    return item.get('id')?.value ?? index;
  }

  /**
   * Crate FormGroup control and add it to the necessary position in array
   * @param index
   */
  public insertAfter = (index: number) => (): void => {
    const newGroup = this.createWordGroup({
      id: generateCompactId(),
      term: '',
      definition: '',
      isNew: true,
    });
    this.wordGroup.insert(index + 1, newGroup);
    this.resetState();
  };

  /**
   * Create FormControl
   * @param data
   * @private
   */
  private createWordGroup(data: WordItemIsNew): FormGroup<WordItemControl> {
    return this.fb.group({
      id: this.fb.control(data.id),
      term: this.fb.control(data.term, { validators: [Validators.required], updateOn: 'change' }),
      definition: this.fb.control(data.definition, { validators: [Validators.required], updateOn: 'change' }),
      isNew: this.fb.control(data.isNew),
    });
  }

  drop(event: CdkDragDrop<FormGroup[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      const formArray = this.wordGroup;
      const controls = formArray.controls;

      // change order in FormArray
      const moved = controls[event.previousIndex];
      formArray.removeAt(event.previousIndex);
      formArray.insert(event.currentIndex, moved);
    }
  }
}
