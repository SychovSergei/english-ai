import { AppValidationError } from '@core/domain/errors';

export interface LoginCommandPayload {
  email: string;
  password: string;
  fingerprint: string;
  ip: string;
  userAgent: string;
}

export class LoginCommand {
  readonly email: string;
  readonly password: string;
  readonly fingerprint: string;
  readonly ip: string;
  readonly userAgent: string;

  private constructor(payload: LoginCommandPayload) {
    if (!payload.email) {
      throw new Error('Email is required');
    }
    if (!payload.fingerprint) {
      throw new Error('Fingerprint is required');
    }

    this.email = payload.email;
    this.password = payload.password;
    this.fingerprint = payload.fingerprint;
    this.ip = payload.ip;
    this.userAgent = payload.userAgent;
  }

  static create(payload: LoginCommandPayload): LoginCommand {
    // Could be used for validation (e.g., using Zod)
    if (!payload.email?.trim()) throw AppValidationError.singleField('auth', 'email', 'Email value is required');
    if (!payload.fingerprint) throw AppValidationError.singleField('auth', 'fingerprint', 'Fingerprint is required');

    return new LoginCommand(payload);
  }
}

// value: string;
// language: ELangs;
//
// translations: Array<{
//   // id?: TranslationId;
//   value: string;
//   language: ELangs;
//   description: string;
//   difficultyLevel: ELevels;
//   lexicalCategory: ELexicalCategory;
// }>;
//
// isPublic: boolean;
//
// image: {
//   url: string;
//   description?: string;
// };
