import { WordItemIsNew } from '@entities/word-set/models';
import { UiKitModule } from '@shared/ui/ui-kit';
import { WordSetEditorFacade } from '@widgets/word-sets/word-set-editor';
import { WordSetEditorMode } from '@widgets/word-sets/word-set-editor/model/model';
import { WordListFormComponent } from '@widgets/word-sets/word-set-editor/ui';

import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { JsonPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, Input, OnDestroy, OnInit } from '@angular/core';
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
          console.log('component CREATE get data.words', data.words);
        });
    }
    if (this.mode === 'edit' && this.wordSetId) {
      this.facade
        .loadSetForEdit(this.wordSetId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          console.log('component EDIT get data.words', data.words);
        });
    }
  }

  ngOnDestroy(): void {
    console.log('DESTROY WIDGET.....');
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
