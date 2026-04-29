import { ValueObject } from '@core/domain/base/ValueObject';

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(email: string): Email {
    if (!email || email.length === 0) {
      throw new Error('Email is required');
    }

    const normalised = email.trim().toLowerCase();
    if (!Email.EMAIL_REGEX.test(normalised)) {
      throw new Error(`Email format ${email} is invalid`);
    }

    return new Email({ value: normalised });
  }

  equals(otherEmail: Email): boolean {
    return this.props.value === otherEmail.props.value;
  }

  public getDomain(): string {
    return this.props.value.split('@')[1];
  }
}
