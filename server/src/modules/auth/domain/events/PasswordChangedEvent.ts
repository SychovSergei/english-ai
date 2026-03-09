import { DomainEvent } from '@core/domain/base/DomainEvent';
import { PasswordChangedPayload } from '@modules/auth/domain/events/PasswordChangedPayload';

export class PasswordChangedEvent extends DomainEvent<PasswordChangedPayload> {
  constructor(public readonly payload: PasswordChangedPayload) {
    super('PasswordChangedEvent', payload);
  }
}
