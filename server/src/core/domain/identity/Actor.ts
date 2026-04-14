import { OwnerId } from '@core/domain/identity/OwnerId';

import { ActorRole } from '../enums/user-roles.enum';

export abstract class Actor {
  abstract readonly id: string;
  abstract readonly role: ActorRole;
  abstract toOwnerId(): OwnerId;
}
