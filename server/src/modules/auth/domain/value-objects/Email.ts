export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    const normalised = value.trim().toLowerCase();
    if (!Email.EMAIL_REGEX.test(normalised)) {
      throw new Error(`Email is invalid: ${value}`);
    }

    return new Email(normalised);
  }

  equals(otherEmail: Email): boolean {
    return this.value === otherEmail.value;
  }
}
