import { LoggerService } from '@shared/lib/logger/logger.service';
import { TableFilterComponent } from '@shared/ui/table-filter';
import { UiKitModule } from '@shared/ui/ui-kit';
import { WordTableWrapperComponent } from '@widgets/word-table';
import { WordTableActionsComponent } from '@widgets/word-table-actions';

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
    ReactiveFormsModule,
    JsonPipe,
    WordTableWrapperComponent,
  ],
})
export class WordManagementComponent implements OnInit {
  private readonly logger = inject(LoggerService).createLogger('WordManagementComponent');

  filterId = 'word-data-table-filter';

  private fb = inject(FormBuilder);
  form: FormGroup;
  filterDelayValue: string = '';

  public get filterValue(): string {
    return this.form.get('filter')?.value;
  }
  // $filter: Observable<string>; // = signal('');

  // private tableFilterService: TableFilterService
  constructor() {
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
    // this.logger.log('value', value);
    this.filterDelayValue = value;
  }
}
