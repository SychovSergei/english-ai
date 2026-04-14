import { AppValidationError } from '@core/domain/errors';

export interface DeleteWordPayload {
  wordId: string;
}

export class DeleteWordCommand {
  private constructor(public readonly wordId: string) {}

  public static create(props: DeleteWordPayload): DeleteWordCommand {
    if (!props.wordId) throw AppValidationError.singleField('word', 'id', 'ID is required');

    return new DeleteWordCommand(props.wordId);
  }
}
