import { API_DOMAIN } from '@shared/config/api-tokens';

import { Provider } from '@angular/core';

export const COMMON_TEST_PROVIDERS: Provider[] = [{ provide: API_DOMAIN, useValue: 'http://localhost/test-api' }];
