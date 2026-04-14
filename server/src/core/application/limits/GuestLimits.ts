export class GuestLimits {
  constructor(
    public readonly wordsLeft: number,
    public readonly trainingLeft: number,
  ) {}

  canCreateWord(): boolean {
    return this.wordsLeft > 0;
  }

  consumeWord(): GuestLimits {
    if (!this.canCreateWord()) {
      throw new Error('Guest limit exceeded (no words left)');
    }

    return new GuestLimits(this.wordsLeft - 1, this.trainingLeft);
  }

  static default(): GuestLimits {
    // TODO: Get from config ????
    return new GuestLimits(30, 50);
  }
}
