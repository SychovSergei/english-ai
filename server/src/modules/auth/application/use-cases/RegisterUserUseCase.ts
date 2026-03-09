import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { User } from '@modules/auth/domain/entities';
import { UserError } from '@modules/auth/domain/errors/UserError';
import { Email, PasswordHash, UserId } from '@modules/auth/domain/value-objects';

import { IdGenerator } from '@core/application/ports';
import { PasswordHasher } from '@core/application/ports/auth/PasswordHasher';
import { UserRepositoryPort } from '@modules/auth/application/ports';
import { RegisterUserDTO } from '@modules/auth/application/use-cases/dto';

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

  // TODO - Не DTO, а command !!!!
  async execute(dto: RegisterUserDTO): Promise<UserId> {
    const isEmailTaken = await this.userRepo.existsByEmail(dto.email);

    if (isEmailTaken) {
      throw UserError.AlreadyExists(dto.email);
    }

    // 2. Генерация всех ID (Application-driven ID generation)
    const userId = UserId.generate(() => this.idGenerator.generate());
    const settingsId = this.idGenerator.generate();
    const activationId = this.idGenerator.generate();

    // 3. Подготовка Value Objects
    const email = Email.create(dto.email);
    const hashedString = await this.passwordHasher.hash(dto.password);
    const passwordHash = PasswordHash.fromValue(hashedString);

    const user = User.create({
      id: userId,
      email,
      password: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      settingsId,
      activationId,
    });

    await this.userRepo.create(user);

    await this.eventBus.publishMany(user.pullDomainEvents());

    return userId;
  }
}
