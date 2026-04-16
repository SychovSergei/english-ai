import { ActorRole, EGuestRole, EUserRole, GuestRole, UserRole } from '@shared/enums';
import { AuthOwner, OwnerKind } from '@shared/lib';

export class OwnerId implements AuthOwner {
  constructor(
    public readonly kind: OwnerKind,
    public readonly id: string,
    public readonly role: UserRole | GuestRole,
  ) {
    // super(id);
  }

  /**
   * Фабрика для создания пользователя.
   * TypeScript не даст передать сюда EGuestRole.Guest
   */
  static user(id: string, role: UserRole): OwnerId {
    return new OwnerId('user', id, role);
  }

  /**
   * Фабрика для создания гостя.
   * Здесь роль зафиксирована жестко.
   */
  static guest(guestId: string): OwnerId {
    return new OwnerId('guest', guestId, EGuestRole.GUEST);
  }

  // Вспомогательные методы (Type Guards)
  get isAdmin(): boolean {
    return this.role === EUserRole.Admin;
  }
  get isTeacher(): boolean {
    return this.role === EUserRole.Teacher;
  }
  get isGuest(): boolean {
    return this.kind === 'guest';
  }

  /** Удобный геттер для совместимости со старым кодом */
  get value(): string {
    return this.id;
  }

  // // static fromRaw(guestId: string): OwnerId {
  // static from(data: { kind: OwnerKind; id: string; role: UserRole | GuestRole }): OwnerId {
  //   if (!data || !data.id) {
  //     throw new Error('Invalid Owner data');
  //   }
  //
  //   return data.kind === 'user'
  //     ? new OwnerId('user', data.id, data.role)
  //     : new OwnerId('guest', data.id, EGuestRole.GUEST);
  // }

  /**
   * Восстанавливает OwnerId из простого объекта (например, из БД или JSON)
   */
  static fromRaw(raw: { kind: OwnerKind; id: string; role: ActorRole }): OwnerId {
    if (raw.kind === 'user') {
      return OwnerId.user(raw.id, raw.role as UserRole);
    }
    return OwnerId.guest(raw.id);
  }

  /**
   * Сравнение Value Objects.
   * В DDD мы сравниваем не по ссылке, а по значению свойств.
   */
  equals(other: OwnerId | null | undefined): boolean {
    if (!other) return false;
    return this.kind === other.kind && this.id === other.id && this.role === other.role;
  }
}
