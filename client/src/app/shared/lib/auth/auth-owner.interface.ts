export type OwnerKind = 'user' | 'guest';

export interface AuthOwner {
  readonly id: string;
  readonly kind: OwnerKind;
}
