import { User } from '@modules/users/domain/entities';

import { UserRepositoryPort } from '@modules/users/application/ports';

// import { UserRepository } from '@modules/auth/application/ports';
import { UserModel, UserPersistence } from '@modules/users/infrastructure/db/mongo/models/UserModel';
import { UserMapper } from '@modules/users/infrastructure/mappers/UserMapper';

// import { UserModel } from '@infrastructure/db/entities';

export class MongoUserRepository implements UserRepositoryPort {
  async create(user: User): Promise<void> {
    console.log('MongoUserRepository -> create : user', user);
    const userPersistence = UserMapper.toPersistence(user);
    console.log('MongoUserRepository -> create : userPersistence', userPersistence);
    await UserModel.create(userPersistence);

    // const newUser = (await UserModel.create(userPersistence)).toObject();
    // const createdUser = UserMapper.toDomain(newUser);
    // return createdUser;
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
