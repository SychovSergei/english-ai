import { inject, injectable } from 'inversify';

import { GetUserProfileUseCasePort } from '@modules/users/application/ports/GetUserProfileUseCasePort';

import { USER_TYPES } from '@modules/users/constants/user.types';

@injectable()
export class UserUseCases {
  constructor(
    @inject(USER_TYPES.GetUserProfileUseCase)
    public readonly getProfileUC: GetUserProfileUseCasePort,

    // @inject(USER_TYPES.CreateUserUseCase)
    // public readonly createUserUC: CreateUserUseCasePort,

    // @inject(USER_TYPES.UpdateUserUseCase)
    // public readonly updateWordUC: UpdateUserUseCase,
  ) {}
}
