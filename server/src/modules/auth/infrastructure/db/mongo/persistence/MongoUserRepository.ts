import { User } from '@modules/auth/domain/entities';

import { UserRepositoryPort } from '@modules/auth/application/ports';

// import { UserRepository } from '@modules/auth/application/ports';
import { UserModel, UserPersistence } from '@modules/auth/infrastructure/db/mongo/models/UserModel';
import { UserMapper } from '@modules/auth/infrastructure/mappers/UserMapper';

// import { UserModel } from '@infrastructure/db/entities';

export class MongoUserRepository implements UserRepositoryPort {
  async create(user: User): Promise<string | null> {
    const userDoc = await UserModel.create(user);
    return userDoc.id;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!(await UserModel.exists({ email: email }));
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email: email });
    // console.log('MongoUserRepository findByEmail', userDoc);
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean().exec();
    if (!doc) return null;

    return UserMapper.toDomain(doc as UserPersistence);
  }

  async save(user: User): Promise<string | null> {
    const persistence = UserMapper.toPersistence(user);
    await UserModel.updateOne(
      { _id: persistence._id },
      { $set: persistence },
      { upsert: true }, // Создаст, если нет, или обновит, если есть
    );
    return persistence._id.toString();
  }
}
