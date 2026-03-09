import { DomainEvent } from '@core/domain/base/DomainEvent';

export interface EventHandler<E extends DomainEvent = DomainEvent> {
  handle(event: E): Promise<void> | void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHandlerClass<H extends EventHandler<any> = EventHandler<any>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): H;
};
