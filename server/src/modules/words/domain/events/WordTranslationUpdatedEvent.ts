import { DomainEvent } from '@core/domain/base/DomainEvent';
import { WordTranslationUpdatedPayload } from '@modules/words/domain/events/WordTranslationUpdatedPayload';
import { TranslationId } from '@modules/words/domain/value-objects';

export class WordTranslationUpdatedEvent extends DomainEvent<WordTranslationUpdatedPayload> {
  constructor(props: { wordId: string; translationId: TranslationId }) {
    super('WordTranslationUpdatedEvent', props);
  }
}
