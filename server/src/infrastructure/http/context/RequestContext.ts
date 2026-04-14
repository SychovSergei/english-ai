import { AsyncLocalStorage } from 'node:async_hooks';

import { Actor } from '@core/domain/identity/Actor';

export interface RequestContextData {
  actor: Actor;
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContextData>();
