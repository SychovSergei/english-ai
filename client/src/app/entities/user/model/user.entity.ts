import { CreateUserPayload, UpdateUserPayload, UserDto, UserId, UserSettings } from '@entities/user';
import { EUserRole } from '@shared/enums';
import { EntityBase } from '@shared/lib/domain/entity.base';

export interface UserEntityProps {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly settings: UserSettings;
  readonly isActivated: boolean;
}

export class UserEntity extends EntityBase<UserId, UserEntityProps> {
  private constructor(id: UserId, props: UserEntityProps) {
    super(id, props);
  }

  get firstName(): string {
    return this.props.firstName;
  }
  get lastName(): string {
    return this.props.lastName;
  }
  get email(): string {
    return this.props.email;
  }
  get isActivated(): boolean {
    return this.props.isActivated;
  }
  get settings(): UserSettings {
    return this.props.settings;
  }

  static create(data: CreateUserPayload): UserEntity {
    const userId = UserId.generate();
    const props: UserEntityProps = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      settings: UserSettings.createDefault(),
      isActivated: false,
    };

    return new UserEntity(userId, props);
  }

  static restore(data: UserDto): UserEntity {
    const props: UserEntityProps = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      settings: UserSettings.restore(data.settings),
      isActivated: data.isActivated,
    };

    return new UserEntity(UserId.from(data.id), props);
  }

  update(payload: UpdateUserPayload): UserEntity {
    const newProps: UserEntityProps = {
      ...this.props,
      firstName: payload.firstName ?? this.props.firstName,
      lastName: payload.lastName ?? this.props.lastName,
      email: payload.email ?? this.props.email,
      settings: this.props.settings, // TODO payload.settings ?? this.props.settings,
      isActivated: payload.isActivated ?? this.props.isActivated,
    };

    return new UserEntity(this.id, newProps);
  }
}

export interface IUser {
  id?: string;
  name: IUserName;
  email: string;
  password: string;
  role: EUserRole;
  wordSets?: string[];
  sharedWordSets?: string[];
  trainingSessions?: string[];
  settings?: string;
  isActivated: boolean;
  activationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserName {
  firstName: string;
  lastName: string;
}
