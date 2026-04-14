import { UserId } from '@modules/users/domain/value-objects';

export interface PasswordChangedPayload {
  userId: UserId;
}
