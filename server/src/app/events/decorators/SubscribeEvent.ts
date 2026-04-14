import { EventHandlerClass } from '@events/EventHandler';

import 'reflect-metadata';

const subscriberMetadataKey = Symbol('event_subscribers');

export interface EventSubscriptionMetadata {
  eventName: string;
  methodName: string;
}

export function SubscribeEvent(eventName?: string): MethodDecorator {
  return function (target, propertyKey) {
    const existing: EventSubscriptionMetadata[] = Reflect.getMetadata(subscriberMetadataKey, target.constructor) || [];

    existing.push({
      eventName: eventName ?? propertyKey.toString(),
      methodName: propertyKey.toString(),
    });

    Reflect.defineMetadata(subscriberMetadataKey, existing, target.constructor);
  };
}

export function getEventSubscribers(handlerClass: EventHandlerClass): EventSubscriptionMetadata[] {
  return Reflect.getMetadata(subscriberMetadataKey, handlerClass) || [];
}
