import { EGuestRole, GuestRole } from '@core/domain/enums/user-roles.enum';
import { Actor } from '@core/domain/identity/Actor';
import { OwnerId } from '@core/domain/identity/OwnerId';

import { GuestLimits } from '@core/application/limits/GuestLimits';

export class GuestActor extends Actor {
  public readonly role: GuestRole;

  constructor(
    public readonly id: string,
    public readonly limits: GuestLimits,
  ) {
    super();
    this.role = EGuestRole.GUEST;
  }

  get getGuestId(): string {
    return this.id;
  }

  isGuest(): this is GuestActor {
    return true;
  }

  toOwnerId(): OwnerId {
    return OwnerId.guest(this.id);
  }
}
