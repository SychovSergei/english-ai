import { WordItemIsNew } from '@entities/word-set';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { UiKitModule } from '@shared/ui/ui-kit';
import { WordListFormComponent, WordSetEditorFacade, WordSetEditorMode } from '@widgets/word-sets';

import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { JsonPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-word-set-editor',
  standalone: true,
  imports: [UiKitModule, CdkTextareaAutosize, FormsModule, JsonPipe, ReactiveFormsModule, NgIf, WordListFormComponent],
  templateUrl: './word-set-editor.component.html',
  styleUrl: './word-set-editor.component.scss',
})
export class WordSetEditorComponent implements OnInit, OnDestroy {
  private readonly loggerService = inject(LoggerService).createLogger('WordSetEditorComponent');

  @Input({ required: true }) mode: WordSetEditorMode = 'create';
  @Input() wordSetId?: string;

  widgetDataWords$: Observable<WordItemIsNew[]> = new BehaviorSubject<WordItemIsNew[]>([]).asObservable();
  // initialWords$: Observable<WordItem[]> | null = null; // = new BehaviorSubject<WordItem[]>([]);
  // initialWords: WordItem[] = [];

  wordSetForm!: FormGroup;

  constructor(
    private facade: WordSetEditorFacade,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    // console.log('mode', this.mode);

    this.facade.setMode(this.mode);
    this.wordSetForm = this.facade.getForm();
    this.widgetDataWords$ = this.facade.dataWords$;

    // console.log('worSetId', this.wordSetId);

    if (this.mode === 'create') {
      this.facade
        .loadSetForCreate()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.loggerService.log('component CREATE get data.words', data.wordIds);
        });
    }
    if (this.mode === 'edit' && this.wordSetId) {
      // this.facade
      //   .loadSetForEdit(this.wordSetId)
      //   .pipe(takeUntilDestroyed(this.destroyRef))
      //   .subscribe((data) => {
      //     this.loggerService.log('component EDIT get data.words', data.wordIds);
      //   });
    }
  }

  ngOnDestroy(): void {
    this.loggerService.log('DESTROY WIDGET.....');
    this.facade.wordSetForm.controls['words'].patchValue([]);
    this.facade.resetDataWords(); //TODO при удалении компонента -> очищать данные (и вообще надо ли форму держать в сервисе???????)
  }

  onSubmit(): void {
    this.facade.submitForm();
  }

  get isEditMode(): boolean {
    return this.facade.isEditMode();
  }

  public importData(): void {
    this.facade.importWordDialogOpen();
  } // TODO отдельная фича

  checkTermValue(term: string): void {
    this.facade.checkTermValue(term);
  }
}
