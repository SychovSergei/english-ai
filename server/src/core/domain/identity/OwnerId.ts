import { EntityId } from '@core/domain/common';

export type OwnerKind = 'user' | 'guest';

export class OwnerId extends EntityId {
  constructor(
    public readonly kind: OwnerKind,
    public readonly value: string,
  ) {
    super(value);
    // if (value.includes('-')) throw new Error('OwnerId cannot contain hyphens');
  }

  static user(userId: string): OwnerId {
    return new OwnerId('user', userId);
  }

  static guest(guestId: string): OwnerId {
    return new OwnerId('guest', guestId);
  }

  equals(other: OwnerId): boolean {
    return this.kind === other.kind && this.value === other.value;
  }
}
