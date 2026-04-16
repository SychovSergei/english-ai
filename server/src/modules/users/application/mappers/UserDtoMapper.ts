import { User } from '@modules/users/domain/entities';

import { UserDto } from '@modules/users/application/dtos';

export class UserDtoMapper {
  /**
   * Из Домена -> в DTO для фронтенда (Angular)
   * Используется в UseCase перед отправкой ответа
   */
  static toDto(user: User): UserDto {
    return {
      id: user.id.value,
      email: user.email.value,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      settings: {
        defaultLanguage: user.settings.props.defaultLanguage,
        translationLanguage: user.settings.props.translationLanguage,
        interfaceLanguage: user.settings.props.interfaceLanguage,
      }, // Настройки (тема, язык интерфейса и т.д.)
      isActivated: user.isActivated,
    };
  }
}
