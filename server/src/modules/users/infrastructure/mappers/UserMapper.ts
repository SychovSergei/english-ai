import { PasswordHash } from '@modules/auth/domain/value-objects';
import { User } from '@modules/users/domain/entities';
import { Email, UserId, UserSettings } from '@modules/users/domain/value-objects';

import { UserDto } from '@modules/users/application/dtos';

import { UserPersistence } from '@modules/users/infrastructure/db/mongo/models/UserModel';

export class UserMapper {
  /**
   * Из Базы Данных -> в Доменную Сущность (User)
   * Используется в UserRepository.findById()
   */
  static toDomain(doc: UserPersistence): User {
    const userId = UserId.from(doc._id.toString());
    const email = Email.create(doc.email);
    const password = PasswordHash.fromValue(doc.passwordHash);
    const settings = UserSettings.create(doc.settings);

    return User.reconstitute(userId, {
      email,
      password, // Предполагаем, что хеш уже в базе
      firstName: doc.name.firstName,
      lastName: doc.name.lastName,
      role: doc.role,
      isActivated: doc.isActivated,
      activationId: doc.activationId,
      settings,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /**
   * Из Домена -> в Объект для MongoDB
   * Используется в UserRepository.save()
   */
  static toPersistence(user: User): UserPersistence {
    return {
      _id: user.id.value, //new Types.ObjectId(user.id.value),
      email: user.email.value,
      passwordHash: user.password.value,
      name: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      role: user.role,
      isActivated: user.isActivated,
      activationId: user.activationId,
      // Распаковываем Value Object настроек обратно в плоский JS-объект
      settings: {
        defaultLanguage: user.settings.props.defaultLanguage,
        translationLanguage: user.settings.props.translationLanguage,
        interfaceLanguage: user.settings.props.interfaceLanguage,
      },
      createdAt: user.createdAt,
      updatedAt: new Date(), // Обновляем дату при каждом сохранении
    };
  }

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
