import { CreateWordSetComponent } from '@pages/word-sets';
import { COMMON_TEST_PROVIDERS } from '@test/test-providers';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('CreateWordSetComponent', () => {
  let component: CreateWordSetComponent;
  let fixture: ComponentFixture<CreateWordSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NoopAnimationsModule, CreateWordSetComponent],
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

    fixture = TestBed.createComponent(CreateWordSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
