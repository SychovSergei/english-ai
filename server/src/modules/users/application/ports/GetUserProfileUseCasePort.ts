import { UserDto } from '@modules/users/application/dtos';

export interface GetUserProfileUseCasePort {
  execute(): Promise<UserDto>;
}
