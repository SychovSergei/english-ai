import { Container } from 'inversify';

import { ConfigServicePort } from '@core/application/ports';

import { ConfigService } from '@infrastructure/config';

import { CORE_TYPES } from '@core/constants/types';

export function bindConfig(container: Container): void {
  container.bind<ConfigServicePort>(CORE_TYPES.ConfigService).to(ConfigService).inSingletonScope();
}
