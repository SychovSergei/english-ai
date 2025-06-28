import { injectable } from 'inversify';

import { User } from '@core/domain/entities';
import { UserError } from '@core/domain/errors/user.error';
import { IUserRepositoryService } from '@core/repositories';
import { UserModel } from '@infrastructure/db/entities';

@injectable()
export class UserRepositoryService implements IUserRepositoryService {
  async getAll(): Promise<User[]> {
    const users = await UserModel.find({});
    console.log('users =', users);
    return users;
  }

  async createUser(userData: User): Promise<User> {
    const newUser = new UserModel(userData);
    const savedUser = (await newUser.save()).toObject({ transform: true }); // //).toObject({ getters: true, transform: true }); //

    if (!savedUser) throw UserError.BadRequest('not-created', 'user did not create');
    console.log('savedUser =', savedUser);
    const id = savedUser._id?.toString().trim() || savedUser.id?.toString().trim();
    const user = await UserModel.findById(id).lean().exec();
    // .populate({ path: "settings", select: "-_id -__v" })
    // .lean()
    // .exec()) as DocResponseWithId<UserDataForTokensModify> | null;

    if (!user) throw UserError.NotFound(userData.email);

    const userBody: User = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      activationId: user.activationId,
      password: user.password,
      isActivated: user.isActivated,
      wordSets: user.wordSets, //.map((id: Types.ObjectId) => id.toString()),
      sharedWordSets: user.sharedWordSets, //.map((id: Types.ObjectId) => id.toString()),
      trainingSessions: user.trainingSessions, //.map((id: Types.ObjectId) => id.toString()),
      settingsId: user.settingsId, //.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }; // { ...savedUser, id: newUser._id }; //: WithId<user-model, string> .toString()

    return userBody; //userBody;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email });
    const userObj = user ? user.toObject() : null;
    console.log('userObj =', userObj);
    return userObj;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw UserError.NotFound(id);
    }
    const userObj = user.toObject();
    console.log('UserRepositoryService findById()userObj =', userObj);
    return userObj;
  }

  // async getUserForTokenByEmail(email: string): Promise<UserDataForTokensModify | null> {
  //   const userWithSettings = await user-model.findOne({ email }).populate({
  //     path: "settings",
  //     select: "-_id -__v",
  //   });
  //   // .lean()
  //   // .exec();
  //   // const userWithSettingsObj: UserDataForTokensModify | null =
  //   return userWithSettings ? userWithSettings.toObject() : null;
  // }
}
