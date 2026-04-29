import { EditWordSetComponent } from '@pages/word-sets';
import { COMMON_TEST_PROVIDERS } from '@test/test-providers';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('EditWordSetComponent', () => {
  let component: EditWordSetComponent;
  let fixture: ComponentFixture<EditWordSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWordSetComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        ...COMMON_TEST_PROVIDERS,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'mock-id' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditWordSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
