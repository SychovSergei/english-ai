import { DomainEvent } from '@core/domain/base/DomainEvent';
import { EmailChangedPayload } from '@modules/auth/domain/events/EmailChangedPayload';

export class EmailChangedEvent extends DomainEvent<EmailChangedPayload> {
  constructor(public readonly payload: EmailChangedPayload) {
    super('PasswordChangedEvent', payload);
  }
}
