import { GuestActor } from '@core/application/identity/GuestActor';

export interface GuestWordLimitServicePort {
  assertCanCreateWord(actor: GuestActor): Promise<void>;
  recordWordCreated(actor: GuestActor): Promise<void>;
}
