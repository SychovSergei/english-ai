import { OwnerId } from '@core/domain/identity/OwnerId';

export interface WordCreatedPayload {
  wordId: string;
  value: string;
  owner: OwnerId;
}
