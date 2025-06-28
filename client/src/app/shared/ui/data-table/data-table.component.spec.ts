import { HasId } from '@shared/interfaces';
import { DataTableComponent } from '@shared/ui';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TableComponent', () => {
  let component: DataTableComponent<HasId>;
  let fixture: ComponentFixture<DataTableComponent<HasId>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent, NoopAnimationsModule, MatTableModule, MatPaginatorModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.dataSource = new MatTableDataSource<HasId>([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
