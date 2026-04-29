import { LoggerService } from '@shared/lib/logger/logger.service';
import { TableFilterService } from '@shared/ui/table-filter';
import { UiKitModule } from '@shared/ui/ui-kit';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  // SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-data-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
  standalone: true,
  imports: [UiKitModule, FormsModule],
  providers: [TableFilterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterComponent implements OnInit, ControlValueAccessor {
  private destroyRef = inject(DestroyRef);
  private readonly logger = inject(LoggerService).createLogger('TableFilterComponent');

  @Input() filterId: string = '';
  @Input() delayVal: number = 500;

  @Input() inputId = 'default-id';
  @Input() name = 'default-name';
  @Input() labelName: string = 'default-label';
  @Input() placeholder: string = 'Search...';
  @Input() required: boolean = false;

  // private fb = inject(FormBuilder);
  public control: AbstractControl | null = null;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  // public form: FormGroup = this.fb.group({
  //   filter: [''],
  // });

  value: string = '';
  disabled: boolean = false;
  //// eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange!: (value: string) => void; // = (value: string) => {};
  onTouched: (value: string) => void = () => {};

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    // private filterService: TableFilterService,
  ) {
    this.ngControl.valueAccessor = this;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['filterId']) {
  //     this.filterService.initFilter(this.filterId);
  //   }
  // }

  ngOnInit(): void {
    // this.onInputChange();

    this.control = this.ngControl.control;
    // console.log('NG CONTROL', this.control);
    this.control?.valueChanges
      .pipe(debounceTime(this.delayVal), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((val: string) => {
        // this.logger.log('filter control SUB value is changed', val);
        this.valueChange.emit(val);
        // this.value = val;
        // this.filterService.changeFilterValue(this.filterId, val);
      });
  }

  // private onInputChange(): void {
  //   this.form.controls['filter'].valueChanges
  //     .pipe(debounceTime(this.delayVal), distinctUntilChanged(), takeUntil(this._destroy$))
  //     .subscribe((val) => {
  //       const res = this.filterService.setFilter(this.filterId, val.toString());
  //       console.log('onInputChange', res);
  //     });
  // }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(val: string): void {
    this.value = val;
  }
}
