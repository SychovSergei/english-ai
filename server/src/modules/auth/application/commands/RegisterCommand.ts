import { AppValidationError } from '@core/domain/errors';

export type RegisterName = {
  firstName: string;
  lastName: string;
};
export interface RegisterCommandPayload {
  email: string;
  password: string;
  name: RegisterName;
}

export class RegisterCommand {
  readonly email: string;
  readonly password: string;
  readonly name: {
    firstName: string;
    lastName: string;
  };

  private constructor(payload: RegisterCommandPayload) {
    if (!payload.email) {
      throw new Error('Email is required');
    }

    this.email = payload.email;
    this.password = payload.password;
    this.name = {
      firstName: payload.name.firstName,
      lastName: payload.name.lastName,
    };
  }

  static create(payload: RegisterCommandPayload): RegisterCommand {
    // TODO Could be used for validation (e.g., using Zod)
    if (!payload.email?.trim()) throw AppValidationError.singleField('auth', 'email', 'Email value is required');
    if (!payload.name.firstName.trim())
      throw AppValidationError.singleField('auth', 'firstName', 'First name value is required');
    if (!payload.name.lastName.trim())
      throw AppValidationError.singleField('auth', 'lastName', 'Last name value is required');
    if (!payload.password.trim())
      throw AppValidationError.singleField('auth', 'password', 'Password value is required');

    return new RegisterCommand(payload);
  }
}
