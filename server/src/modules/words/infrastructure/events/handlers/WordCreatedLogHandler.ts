import { injectable } from 'inversify';

import { SubscribeEvent } from '@events/decorators/SubscribeEvent';
import { EventHandler } from '@events/EventHandler';

import { WordCreatedEvent } from '@modules/words/domain/events';

@injectable()
export class WordCreatedLogHandler implements EventHandler<WordCreatedEvent> {
  //<DomainEvent>
  @SubscribeEvent(WordCreatedEvent.name)
  public handle(event: WordCreatedEvent): void {
    console.log(`[WordCreatedLogHandler] Word created: ${event.payload.wordId} by user ${event.payload.owner}`);
  }
}
