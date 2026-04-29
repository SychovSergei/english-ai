import { Container } from 'inversify';

import { getEventSubscribers } from '@events/decorators/SubscribeEvent';
import { EventBus } from '@events/EventBus';
import { EventHandler, EventHandlerClass } from '@events/EventHandler';

import { DomainEvent } from '@core/domain/base/DomainEvent';

import 'reflect-metadata';

export interface IHandleEvent {
  handle(event: any): void | Promise<void>;
}

export function registerEventHandlersDI(
  container: Container,
  eventBus: EventBus,
  handlerClasses: EventHandlerClass<EventHandler<DomainEvent>>[],
): void {
  handlerClasses.forEach((HandlerClass) => {
    const handlerInstance = container.get(HandlerClass);

    const subs = getEventSubscribers(HandlerClass);

    subs.forEach((sub) => {
      // единственный безопасный cast — доступ по строковому имени метода
      const method = (handlerInstance as any)[sub.methodName].bind(handlerInstance);
      eventBus.subscribe(sub.eventName, method);
    });
  });
}
