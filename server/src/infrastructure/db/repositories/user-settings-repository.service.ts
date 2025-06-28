import { Types } from 'mongoose';
import { injectable } from 'inversify';

import { UserSettings } from '@core/domain/entities';
import { IUserSettingsRepository } from '@core/repositories';
import { UserSettingsModel } from '@infrastructure/db/entities';

@injectable()
export class UserSettingsRepositoryService implements IUserSettingsRepository {
  async findById(id: string): Promise<UserSettings | null> {
    console.log('id: ', id);
    const settings = await UserSettingsModel.findOne({
      _id: new Types.ObjectId(id),
    }); // as DocResponseWithId<UserSettings>; //"671eb1d9588c00c5a7fd91a5",
    console.log('findById settings', settings);
    return settings;
  }

  async createSettings(newDocument: UserSettings): Promise<UserSettings | null> {
    const newSetCreated = (await UserSettingsModel.create(newDocument)).toObject();
    console.log(newSetCreated);
    return newSetCreated;
  }

  async updateSettings(newSettings: UserSettings): Promise<UserSettings | null> {
    const updatedSettings = await UserSettingsModel.findOneAndUpdate(
      { owner: '671eb1d9588c00c5a7fd91a5' }, //TODO земенить ID
      newSettings,
      {
        new: true,
      },
    );
    console.log(updatedSettings);
    return updatedSettings;
  }
}
