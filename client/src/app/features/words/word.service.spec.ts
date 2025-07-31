import { COMMON_TEST_PROVIDERS } from '@test/test-providers';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WordService } from './word.service';

describe('WordService', () => {
  let service: WordService;

  TestBed.configureTestingModule({
    providers: [
      WordService,
      // { provide: API_DOMAIN, useValue: 'http://localhost:3000' }, // ✅ МОК значение
    ],
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [...COMMON_TEST_PROVIDERS],
    });
    service = TestBed.inject(WordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
