import { Actor } from '@core/domain/identity/Actor';

export interface IdentityProvider {
  getCurrentActor(): Actor;
}
