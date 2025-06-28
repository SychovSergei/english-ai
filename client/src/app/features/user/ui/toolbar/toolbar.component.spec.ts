import { ToolbarComponent } from '@features/user/ui';
import { COMMON_TEST_PROVIDERS } from '@test/test-providers';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent, HttpClientTestingModule], // <-- добавь сюда],
      providers: [...COMMON_TEST_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges(); // 2-я проверка стабилизирует шаблон
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
