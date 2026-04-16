import { injectable } from 'inversify';

import { Actor } from '@core/domain/identity/Actor';

import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';

import { requestContext } from '@infrastructure/http/context/RequestContext';

@injectable()
export class AsyncLocalStorageIdentifyProvider implements IdentityProvider {
  getCurrentActor(): Actor {
    const store = requestContext.getStore();
    if (!store?.actor) {
      throw new Error('No actor found in RequestContext');
    }
    // console.log('AsyncLocalStorageIdentifyProvider', store.actor);

    return store.actor;
  }
}
