import { EventHandler } from '@events/EventHandler';

import { DomainEvent } from '@core/domain/base/DomainEvent';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishMany(event: DomainEvent[]): Promise<void>;

  subscribe(eventName: string, handler: EventHandler): void;
  unsubscribe(eventName: string, handler: EventHandler): void;
}
