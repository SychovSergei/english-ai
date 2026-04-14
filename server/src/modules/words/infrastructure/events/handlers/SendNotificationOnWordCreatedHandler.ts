import { SubscribeEvent } from '@events/decorators/SubscribeEvent';
import { EventHandler } from '@events/EventHandler';

import { WordCreatedEvent } from '@modules/words/domain/events';

import { NotificationPort } from '@core/application/ports/NotificationPort';

// import { WordCreatedEvent } from '@modules/words/domain';

export class SendNotificationOnWordCreatedHandler implements EventHandler<WordCreatedEvent> {
  constructor(private readonly notifier: NotificationPort) {}

  @SubscribeEvent(WordCreatedEvent.name)
  async handle(event: WordCreatedEvent): Promise<void> {
    const { wordId, value } = event.payload;

    await this.notifier.send({
      userId: 'SYSTEM', // или event.owner если добавишь owner в payload
      message: `New word created: ${value} (ID: ${wordId})`,
    });
  }
}
