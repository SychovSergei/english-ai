import { Container } from 'inversify';

import { InMemoryEventBus } from '@events/InMemoryEventBus';

import { CORE_TYPES } from '@core/constants/types';

export function bindEventBus(container: Container): void {
  container.bind(CORE_TYPES.EventBus).to(InMemoryEventBus).inSingletonScope();
}
