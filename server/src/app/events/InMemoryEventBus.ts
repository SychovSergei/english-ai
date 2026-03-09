import { injectable } from 'inversify';

import { DomainEvent } from '@core/domain/base/DomainEvent';

import { EventBus } from './EventBus';
import { EventHandler } from './EventHandler';

@injectable()
export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.name) ?? new Set();

    for (const handler of handlers) {
      try {
        await handler.handle(event);
      } catch (err) {
        // логирование/обработка ошибки — не ломаем остальных обработчиков
        console.error(`[EventBus] Error in handler for ${event.name}:`, err);
      }
    }
  }

  async publishMany(events: DomainEvent[]): Promise<void> {
    for (const e of events) {
      await this.publish(e);
    }
  }

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) this.handlers.set(eventName, new Set());

    this.handlers.get(eventName)?.add(handler);
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    this.handlers.get(eventName)?.delete(handler);
  }
}
