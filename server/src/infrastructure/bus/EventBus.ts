// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler = (event: any) => void;

export class EventBus {
  private static handlers: { [eventName: string]: EventHandler[] } = {};

  static subscribe(eventName: string, handler: EventHandler) {
    if (!this.handlers[eventName]) this.handlers[eventName] = [];
    this.handlers[eventName].push(handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static publish(event: any) {
    const handlers = this.handlers[event.constructor.name] || [];
    handlers.forEach((h) => h(event));
  }
}
