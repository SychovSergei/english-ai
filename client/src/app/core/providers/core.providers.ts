import { environment } from '@environments/environment';
import { API_DOMAIN } from '@shared/config/api-tokens';

export const CORE_PROVIDERS = [{ provide: API_DOMAIN, useValue: environment.apiDomain }];
