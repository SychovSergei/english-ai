import { AppValidationError } from '@core/domain/errors';

export interface IdentifyGuestCommandPayload {
  fingerprint: string;
  guestId?: string;
  ip?: string;
}

export class IdentifyGuestCommand {
  public readonly fingerprint: string;
  public readonly guestId?: string;
  public readonly ip?: string;

  private constructor(payload: IdentifyGuestCommandPayload) {
    this.fingerprint = payload.fingerprint;
    this.guestId = payload.guestId;
    this.ip = payload.ip;
  }

  public static create(payload: IdentifyGuestCommandPayload): IdentifyGuestCommand {
    if (!payload.fingerprint)
      throw AppValidationError.singleField('guest', 'fingerprint', 'Fingerprint is required and it cannot be empty');

    return new IdentifyGuestCommand(payload);
  }
}
