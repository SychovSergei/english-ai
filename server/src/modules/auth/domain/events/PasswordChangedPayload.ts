import { UserId } from '@modules/auth/domain/value-objects/UserId';

export interface PasswordChangedPayload {
  userId: UserId;
}
