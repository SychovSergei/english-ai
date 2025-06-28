// import { API_DOMAIN } from '@shared/config/api-tokens';
import { COMMON_TEST_PROVIDERS } from '@test/test-providers';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { WordSetEditorComponent } from './word-set-editor.component';

describe('WordSetEditorComponent', () => {
  let component: WordSetEditorComponent;
  let fixture: ComponentFixture<WordSetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordSetEditorComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        ...COMMON_TEST_PROVIDERS,
        // { provide: API_DOMAIN, useValue: 'http://test-api' }, // <-- нужная строка
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WordSetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
