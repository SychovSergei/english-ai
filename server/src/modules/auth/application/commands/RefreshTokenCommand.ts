import { AppValidationError } from '@core/domain/errors';

export interface RefreshTokenCommandPayload {
  refreshToken: string;
  fingerprint: string;
}

export class RefreshTokenCommand {
  readonly refreshToken: string;
  readonly fingerprint: string;

  private constructor(payload: RefreshTokenCommandPayload) {
    if (!payload.refreshToken) {
      throw new Error('RefreshToken is required');
    }
    if (!payload.fingerprint) {
      throw new Error('Fingerprint is required');
    }

    this.refreshToken = payload.refreshToken;
    this.fingerprint = payload.fingerprint;
  }

  static create(payload: RefreshTokenCommandPayload): RefreshTokenCommand {
    // Could be used for validation (e.g., using Zod)
    if (!payload.fingerprint) throw AppValidationError.singleField('auth', 'fingerprint', 'Fingerprint is required');

    return new RefreshTokenCommand(payload);
  }
}
