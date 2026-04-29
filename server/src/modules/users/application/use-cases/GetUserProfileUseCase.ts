import { inject, injectable } from 'inversify';

import { EventBus } from '@events/EventBus';

import { AuthError } from '@modules/auth/domain/errors';

import { UserActor } from '@core/application/identity';
import { IdGenerator } from '@core/application/ports';
import { BaseUseCase } from '@core/application/use-cases';
import { UserDto } from '@modules/users/application/dtos';
import { UserDtoMapper } from '@modules/users/application/mappers';
import { GetUserProfileUseCasePort, UserRepositoryPort } from '@modules/users/application/ports';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

@injectable()
export class GetUserProfileUseCase extends BaseUseCase<void, UserDto> implements GetUserProfileUseCasePort {
  constructor(
    @inject(CORE_TYPES.EventBus) private readonly eventBus: EventBus,
    @inject(CORE_TYPES.IdGenerator) private readonly idGenerator: IdGenerator,
    @inject(AUTH_TYPES.UserRepository) private readonly userRepo: UserRepositoryPort,
  ) {
    super();
  }

  //cmd: GetUserProfileCommand
  async execute(): Promise<UserDto> {
    console.log('GetUserProfileUseCase_______________________________');

    const actor = this.actor; // Из BaseUseCase
    console.log('GetUserProfileUseCase -> execute -> actor', actor);

    if (!(actor instanceof UserActor)) {
      throw AuthError.Unauthorized('Only for authorized users');
    }

    const user = await this.userRepo.findById(actor.id);
    if (!user) {
      throw AuthError.Unauthorized('User not found');
    }

    // await this.eventBus.publishMany(word.pullDomainEvents());

    return UserDtoMapper.toDto(user);
  }
}
