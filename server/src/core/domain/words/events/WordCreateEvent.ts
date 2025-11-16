export class WordCreatedEvent {
  constructor(
    public readonly wordId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
