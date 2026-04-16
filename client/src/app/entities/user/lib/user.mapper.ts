import { UserDto, UserEntity, UserSettings } from '@entities/user';

export class UserMapper {
  static toDomain(dto: UserDto): UserEntity {
    return UserEntity.restore({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      isActivated: dto.isActivated,
      settings: UserSettings.restore({
        defaultLanguage: dto.settings.defaultLanguage,
        translationLanguage: dto.settings.translationLanguage,
        interfaceLanguage: dto.settings.interfaceLanguage,
      }),
    });
  }
}
