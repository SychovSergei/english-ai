// // import { DataTableComponent } from '@shared/ui';
//
// import { EntityId } from '@entities/word/model/entity-id';
// import { DataTableComponent } from '@shared/ui/data-table/data-table.component';
//
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// // import { DataTableComponent } from '@widgets/data-table/data-table.component';
// // import { EntityId } from '@entities/word/model/entity-id';
//
// describe('TableComponent', () => {
//   let component: DataTableComponent<EntityId>;
//   let fixture: ComponentFixture<DataTableComponent<EntityId>>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [DataTableComponent, NoopAnimationsModule, MatTableModule, MatPaginatorModule],
//     }).compileComponents();
//
//     fixture = TestBed.createComponent(DataTableComponent);
//     component = fixture.componentInstance;
//     component.dataSource = new MatTableDataSource<EntityId>([]);
//
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
