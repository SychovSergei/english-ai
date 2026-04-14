import { AppValidationError } from '@core/domain/errors';

export interface CheckWordExistsCommandPayload {
  value: string;
}

export class CheckWordExistsCommand {
  public readonly value: string;

  private constructor(payload: CheckWordExistsCommandPayload) {
    this.value = payload.value; //.map((v) => v.trim()).filter((v) => v.length > 0);
  }

  public static create(payload: CheckWordExistsCommandPayload): CheckWordExistsCommand {
    if (!payload.value || payload.value.length === 0) {
      throw AppValidationError.singleField('words', 'values', 'Words list cannot be empty');
    }
    return new CheckWordExistsCommand(payload);
  }
}
