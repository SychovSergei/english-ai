import { AppValidationError } from '@core/domain/errors';

export interface LogoutCommandPayload {
  userId: string; // Дополнительная проверка безопасности
  refreshToken: string;
}

export class LogoutCommand {
  readonly userId: string;
  readonly refreshToken: string;

  private constructor(props: LogoutCommandPayload) {
    this.userId = props.userId;
    this.refreshToken = props.refreshToken;
  }

  static create(payload: LogoutCommandPayload): LogoutCommand {
    // Could be used for validation (e.g., using Zod)
    if (!payload.userId?.trim()) throw AppValidationError.singleField('auth', 'email', 'Email value is required');
    if (!payload.refreshToken) throw AppValidationError.singleField('auth', 'fingerprint', 'Fingerprint is required');

    return new LogoutCommand(payload);
  }
}
