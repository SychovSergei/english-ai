import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { PasswordHash } from '@modules/auth/domain/value-objects';
import { User } from '@modules/users/domain/entities/User';
import { UserError } from '@modules/users/domain/errors/UserError';
import { Email, UserId, UserSettings } from '@modules/users/domain/value-objects';

import { IdGenerator } from '@core/application/ports';
import { PasswordHasher } from '@core/application/ports/auth/PasswordHasher';
import { RegisterCommand } from '@modules/auth/application/commands/RegisterCommand';
import { UserRepositoryPort } from '@modules/users/application/ports';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(CORE_TYPES.IdGenerator) private idGenerator: IdGenerator,
    @inject(CORE_TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(CORE_TYPES.PasswordHasher) private passwordHasher: PasswordHasher,
    @inject(AUTH_TYPES.UserRepository) private userRepo: UserRepositoryPort,
  ) {}

  async execute(cmd: RegisterCommand): Promise<User> {
    const isEmailTaken = await this.userRepo.existsByEmail(cmd.email);
    console.log('isEmailTaken', isEmailTaken);

    if (isEmailTaken) {
      throw UserError.AlreadyExists(cmd.email);
    }

    // 2. Генерация всех ID (Application-driven ID generation)
    const userId = UserId.generate(() => this.idGenerator.generate());
    const activationId = this.idGenerator.generate();

    // 3. Подготовка Value Objects
    const email = Email.create(cmd.email);
    const hashedString = await this.passwordHasher.hash(cmd.password);
    const passwordHash = PasswordHash.fromValue(hashedString);
    const settings: UserSettings = UserSettings.createDefault();

    const newUser = User.create({
      id: userId,
      email,
      password: passwordHash,
      firstName: cmd.name.firstName,
      lastName: cmd.name.lastName,
      settings: settings,
      activationId,
    });
    console.log('user', newUser);

    await this.userRepo.create(newUser);

    await this.eventBus.publishMany(newUser.pullDomainEvents());

    return newUser;
  }
}
