export abstract class DomainEvent<TPayload = unknown> {
  public readonly occurredAt: Date;

  protected constructor(
    public readonly name: string,
    public readonly payload: TPayload,
  ) {
    this.occurredAt = new Date();
  }
}
