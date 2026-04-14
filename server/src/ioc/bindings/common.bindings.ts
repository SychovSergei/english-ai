import { Container } from 'inversify';

import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';
import { PasswordHasher } from '@core/application/ports/auth/PasswordHasher';

import { ActorResolver } from '@infrastructure/auth/ActorResolver';
import { AsyncLocalStorageIdentifyProvider } from '@infrastructure/auth/AsyncLocalStorageIdentifyProvider';
import { BcryptHasher } from '@infrastructure/auth/BcryptHasher';
import { RequestContextMiddleware } from '@infrastructure/http/middlewares';
import { IdentityMiddleware } from '@infrastructure/http/middlewares/identityMiddleware';
import { UuidGenerator } from '@infrastructure/id/UuidGenerator';

import { CORE_TYPES } from '@core/constants/types';

export function bindCommon(container: Container): void {
  container
    .bind<IdentityProvider>(CORE_TYPES.IdentityProvider)
    .to(AsyncLocalStorageIdentifyProvider)
    .inSingletonScope();
  container.bind(CORE_TYPES.IdGenerator).to(UuidGenerator).inSingletonScope();
  container.bind<PasswordHasher>(CORE_TYPES.PasswordHasher).to(BcryptHasher).inSingletonScope();
  container.bind<ActorResolver>(CORE_TYPES.ActorResolver).to(ActorResolver).inSingletonScope();

  container.bind<RequestContextMiddleware>(RequestContextMiddleware).toSelf();
  container.bind<IdentityMiddleware>(IdentityMiddleware).toSelf().inSingletonScope();
  // container.bind<IdentityMiddleware>(CORE_TYPES.IdentityMiddleware).to(IdentityMiddleware).inSingletonScope();
}
