import { WordItem } from '@entities/word-set';
import { FloatButtonModule } from '@shared/directives/add-floating-button';
import { UiKitModule } from '@shared/ui/ui-kit';

import { JsonPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

interface InitialDataControl {
  id: FormControl<string | null>;
  term: FormControl<string | null>;
  definition: FormControl<string | null>;
}

@Component({
  selector: 'app-simple-word-list',
  templateUrl: './simple-word-list.component.html',
  styleUrls: ['./simple-word-list.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    UiKitModule,
    NgForOf,
    ReactiveFormsModule,
    JsonPipe,
    MatGridList,
    MatGridTile,

    FloatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleWordListComponent implements OnChanges, OnInit {
  @Input() list: WordItem[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  get listArr(): FormArray {
    return this.form.controls['items'] as FormArray<FormControl<InitialDataControl>>;
  }

  ngOnInit(): void {
    this.form.controls['items'].valueChanges.subscribe((data) => {
      console.log(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list']) {
      this.listArr.clear();
      for (const item of this.list) {
        this.addItemToForm(item);
      }
    }
  }

  addItemToForm(data: WordItem): void {
    const newItem = this.fb.group({
      id: [data], //{ value: data.id }
      term: [data.term], //{ value: data.term }, disabled: true
      definition: [data.definition], //{ value: data.definition }, disabled: true
    });
    this.listArr.push(newItem, { emitEvent: false });
  }

  public trackById(index: number, item: AbstractControl): string {
    return item.get('id')?.value ?? index;
  }
}
