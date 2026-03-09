import { AggregateRoot } from '@core/domain/base/AggregateRoot';
import { EUserRole } from '@core/domain/enums';
import { PasswordChangedEvent, UserCreatedEvent } from '@modules/auth/domain/events';
import { EmailChangedEvent } from '@modules/auth/domain/events/EmailChangedEvent';
import { Email, PasswordHash, UserId } from '@modules/auth/domain/value-objects';

export class User extends AggregateRoot<UserId> {
  private constructor(
    public readonly id: UserId,
    private props: {
      email: Email;
      password: PasswordHash;

      role: EUserRole; // Доменно-ориентированная роль
      settingsId: string; // Ссылка на другой агрегат

      firstName: string;
      lastName: string;

      activationId: string; // Для бизнес-процесса активации
      isActivated: boolean;

      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    super(id);
  }

  // Геттеры для маппера (чтобы не открывать свойства на запись)
  get email(): Email {
    return this.props.email;
  }
  get password(): PasswordHash {
    return this.props.password;
  }
  get role(): EUserRole {
    return this.props.role;
  }
  get firstName(): string {
    return this.props.firstName;
  }
  get lastName(): string {
    return this.props.lastName;
  }
  get isActivated(): boolean {
    return this.props.isActivated;
  }
  get activationId(): string {
    return this.props.activationId;
  }
  get settingsId(): string {
    return this.props.settingsId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: {
    id: UserId;
    email: Email;
    password: PasswordHash;
    firstName: string;
    lastName: string;
    settingsId: string;
    activationId: string;
  }): User {
    const user = new User(props.id, {
      email: props.email,
      password: props.password,
      firstName: props.firstName,
      lastName: props.lastName,
      role: EUserRole.STUDENT,
      settingsId: props.settingsId,
      activationId: props.activationId,
      isActivated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Добавляем событие: "Пользователь создан"
    // Подписчик в инфраструктуре (EmailService) поймает его и отправит письмо с activationId
    user.addDomainEvent(
      new UserCreatedEvent({ userId: user.id.value, email: user.email.value, activationId: user.props.activationId }),
    );

    return user;
  }

  // Фабрика для восстановления из БД (в Mapper)
  static reconstitute(id: UserId, props: any): User {
    return new User(id, props);
  }

  /**
   * Смена Email
   */
  changeEmail(newEmail: Email): void {
    if (this.props.email.equals(newEmail)) return; // Или throw Error, если это критично
    this.props.email = newEmail;
    this.props.isActivated = false; // При смене email сбрасываем активацию
    this.props.updatedAt = new Date();

    // Генерируем событие (например, чтобы отправить новое письмо для подтверждения)
    this.addDomainEvent(new EmailChangedEvent({ userId: this.id.value, email: this.email.value }));
  }

  /**
   * Смена пароля
   */
  changePassword(newPasswordHash: PasswordHash): void {
    // Правило: новый пароль не должен совпадать со старым (хешем)
    if (this.props.password.equals(newPasswordHash)) {
      throw new Error('New password must be different');
    }

    this.props.password = newPasswordHash;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new PasswordChangedEvent({ userId: this.id }));
  }

  public activate(id: string): void {
    if (this.props.isActivated) {
      throw new Error('User already activated');
    }
    if (this.props.activationId !== id) {
      throw new Error('Invalid activation code');
    }
    this.props.isActivated = true;
  }
}
