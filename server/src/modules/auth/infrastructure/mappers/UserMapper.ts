import { Types } from 'mongoose';

import { User } from '@modules/auth/domain/entities';
import { Email, PasswordHash, UserId } from '@modules/auth/domain/value-objects';

import { UserPersistence } from '@modules/auth/infrastructure/db/mongo/models/UserModel';

export class UserMapper {
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
      settingsId: user.settingsId, //new Types.ObjectId(user.settingsId),
      createdAt: user.createdAt,
      updatedAt: new Date(), // Обновляем дату при каждом сохранении
    };
  }

  static toDomain(doc: UserPersistence): User {
    return User.reconstitute(UserId.from(doc._id.toString()), {
      email: Email.create(doc.email),
      // Здесь используем fromValue, так как пароль уже захеширован в базе
      password: PasswordHash.fromValue(doc.passwordHash), // Предполагаем, что хеш уже в базе
      firstName: doc.name.firstName,
      lastName: doc.name.lastName,
      role: doc.role,
      isActivated: doc.isActivated,
      activationId: doc.activationId,
      settingsId: doc.settingsId, //.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
