import { UserRole } from '@core/domain/enums';
import { Actor, OwnerId } from '@core/domain/identity';

export class UserActor extends Actor {
  constructor(
    public readonly id: string,
    public readonly role: UserRole,
    public readonly email: string,
    public readonly name: string,
  ) {
    super();
  }

  isUser(): this is UserActor {
    return true;
  }

  toOwnerId(): OwnerId {
    return OwnerId.user(this.id);
  }
}
