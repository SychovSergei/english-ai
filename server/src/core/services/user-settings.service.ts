import { DiTypes } from '@shared/types';
import { inject, injectable } from 'inversify';

import { UserSettings } from '@core/domain/entities';
import { ELangs } from '@core/domain/enums';
import { SettingsError } from '@core/domain/errors';
import { IUserSettingsRepository, IUserSettingsService } from '@core/repositories';

@injectable()
export class UserSettingsService implements IUserSettingsService {
  constructor(@inject(DiTypes.UserSettingsRepositoryService) private userSettingsRepository: IUserSettingsRepository) {}

  async getSettings(id: string): Promise<UserSettings | null> {
    console.log('UserSettingService getSettings', id);
    const settings = await this.userSettingsRepository.findById(id);

    if (!settings) {
      throw SettingsError.NotFound();
    }
    return settings;
  }

  // async createSetting(): Promise<DocResponseWithId<UserSettings>> {
  async createSetting(): Promise<Required<UserSettings>> {
    console.log('UserSettingService createSetting');
    // const settings = await SettingsModel.findOne({ userId: "671eb1d9588c00c5a7fd91a5" });
    const newDocument: UserSettings = {
      defaultLanguage: ELangs.EN,
      translationLanguage: ELangs.RU,
      interfaceLanguage: ELangs.EN,
    };
    /** const newSetCreated = (await UserSettingsModel.create(newDocument)).toObject(); // as unknown as DocResponseWithId<UserSettings>;*/
    const newSetCreated = await this.userSettingsRepository.createSettings(newDocument);

    if (!newSetCreated || !newSetCreated.id?.toString()) {
      throw SettingsError.BadRequest('settings', 'Settings save error');
    }
    // if (!settings) {
    //   throw SettingsError.NotFound();
    // }
    return {
      id: newSetCreated.id,
      interfaceLanguage: newSetCreated.interfaceLanguage,
      defaultLanguage: newSetCreated.defaultLanguage,
      translationLanguage: newSetCreated.translationLanguage,
    };
  }

  // async updateSettings(newSettings: Partial<UserSettings>): Promise<UserSettings> {
  async updateSettings(newSettings: UserSettings): Promise<UserSettings> {
    // const settings = (await UserSettingsModel.findOneAndUpdate({ owner: "671eb1d9588c00c5a7fd91a5" }, newSettings, {
    //   new: true,
    // })) as DocResponseWithId<UserSettings>;
    const settings = await this.userSettingsRepository.updateSettings(newSettings);
    if (!settings) {
      throw SettingsError.NotFound();
    }
    return settings;
  }
}
