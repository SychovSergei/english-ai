import { inject, injectable } from 'inversify';

import { PasswordHash } from '@modules/auth/domain/value-objects';

import { IdentityProvider } from '@core/application/ports/auth/IdentityProvider';
import { PasswordHasher } from '@core/application/ports/auth/PasswordHasher';
import { UserRepositoryPort } from '@modules/auth/application/ports';
import { ChangePasswordDTO } from '@modules/auth/application/use-cases/dto';

import { CORE_TYPES } from '@core/constants/types';
import { AUTH_TYPES } from '@modules/auth/constants/auth.types';

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private userRepo: UserRepositoryPort,
    @inject(CORE_TYPES.PasswordHasher) private hasher: PasswordHasher,
    @inject(CORE_TYPES.IdentityProvider) private identityProvider: IdentityProvider,
  ) {}

  // TODO - Не DTO, а command !!!!
  async execute(dto: ChangePasswordDTO): Promise<void> {
    const actor = await this.identityProvider.getCurrentActor();

    // 1. Получаем пользователя (репозиторий использует UserMapper.toDomain)
    const user = await this.userRepo.findById(actor.id);
    if (!user) throw new Error('User not found');

    const hashedString = await this.hasher.hash(dto.newPassword);
    // 2. Создание защищенного объекта
    // Мы вызываем fromHash только ПОСЛЕ того, как получили результат от hasher
    const newPasswordHash = PasswordHash.fromHash(hashedString);

    // 2. Создаем новый хеш (Value Object)
    // const newHash = await PasswordHash.create(dto.newPassword, this.hasher);

    // 3. Вызываем доменный метод (там все проверки)
    user.changePassword(newPasswordHash);

    // 4. Сохраняем (репозиторий использует UserMapper.toPersistence)
    await this.userRepo.save(user);
  }
}
