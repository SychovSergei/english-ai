import { inject, injectable } from 'inversify';

import { Actor } from '@core/domain/identity/Actor';

import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';

import { CORE_TYPES } from '@core/constants/types';

@injectable()
export abstract class BaseUseCase<TRequest, TResponse> {
  // Инжектим прямо в свойство, чтобы не загромождать конструктор super()
  @inject(CORE_TYPES.IdentityProvider)
  protected readonly identityProvider!: IdentityProvider;

  abstract execute(request: TRequest): Promise<TResponse>;

  protected get actor(): Actor {
    return this.identityProvider.getCurrentActor();
  }
}
