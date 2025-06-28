import { WordTableActionsComponent, WordTableComponent } from '@features/words';
import { TableFilterComponent, TableFilterService } from '@shared/ui/table-filter';
import { UiKitModule } from '@shared/ui/ui-kit';

import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-word-management',
  templateUrl: './word-management.component.html',
  styleUrls: ['./word-management.component.scss'],
  standalone: true,
  imports: [
    UiKitModule,
    TableFilterComponent,
    WordTableActionsComponent,
    WordTableComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
})
export class WordManagementComponent implements OnInit {
  filterId = 'word-data-table-filter';

  private fb = inject(FormBuilder);
  form: FormGroup;
  filterDelayValue: string = '';

  public get filterValue(): string {
    return this.form.get('filter')?.value;
  }
  // $filter: Observable<string>; // = signal('');

  constructor(private tableFilterService: TableFilterService) {
    this.form = this.fb.group({
      filter: [''],
    });
    // this.form.controls['filter'].setValue('valueeee');
    // console.log(this.form.get('filter')?.value);

    // this.tableFilterService.setFilter(this.filterId);
    // this.$filter = this.tableFilterService.getFilter(this.filterId);
    // this.tableFilterService.showFilters();
  }

  ngOnInit(): void {
    // this.form.get('filter')?.valueChanges.subscribe((val: string) => {
    //   console.log('filter form', val);
    // });
  }

  onFilterChange(value: string): void {
    console.log('value', value);
    this.filterDelayValue = value;
  }
}
