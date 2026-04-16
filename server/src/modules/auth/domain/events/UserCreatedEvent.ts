import { DomainEvent } from '@core/domain/base/DomainEvent';
import { UserCreatedPayload } from '@modules/auth/domain/events/UserCreatedPayload';

export class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  constructor(public readonly payload: UserCreatedPayload) {
    super('UserCreatedEvent', payload);
  }
}
