import { DomainEvent } from '@core/domain/base/DomainEvent';
import { WordDeletedPayload } from '@modules/words/domain/events/WordDeletedPayload';

export class WordDeletedEvent extends DomainEvent<WordDeletedPayload> {
  constructor(public readonly payload: WordDeletedPayload) {
    super('WordDeletedEvent', payload);
  }
}
