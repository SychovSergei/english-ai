import { DomainEvent } from '@core/domain/base/DomainEvent';
import { WordCreatedPayload } from '@modules/words/domain/events/WordCreatedPayload';

export class WordCreatedEvent extends DomainEvent<WordCreatedPayload> {
  constructor(public readonly payload: WordCreatedPayload) {
    super('WordCreatedEvent', payload);
  }
}
