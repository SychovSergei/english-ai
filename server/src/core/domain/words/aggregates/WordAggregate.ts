import { Word } from '@core/domain/words/entities/Word';
import { WordCreatedEvent } from '@core/domain/words/events/WordCreateEvent';
import { Translation } from '@core/domain/words/value-objects/Translation';

export class WordAggregate {
  constructor(private word: Word) {}

  getWord(): Word {
    return this.word;
  }

  addTranslation(translation: Translation) {
    this.word.addTranslation(translation);
    this.publishEvent(new WordCreatedEvent(this.word.id));
  }

  private publishEvent(event: any) {
    // TODO EventBus.publish(event)
  }
}
