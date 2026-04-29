export class TokenLifetime {
  constructor(private readonly seconds: number) {}

  get ms(): number {
    return this.seconds * 1000;
  }

  getExpirationTimestamp(): number {
    return Date.now() + this.ms;
  }
}
