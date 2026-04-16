import { DomainEvent } from '@core/domain/base/DomainEvent';
import { WordTranslationAddedPayload } from '@modules/words/domain/events/WordTranslationAddedPayload';

export class WordTranslationAddedEvent extends DomainEvent<WordTranslationAddedPayload> {
  constructor(props: { wordId: string; translationId: string }) {
    super('WordTranslationAddedEvent', props);
  }
}
