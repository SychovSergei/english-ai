import UserSettingsModel from "../../infractructure/db/entities/UserSettingsModel";

import { SettingsError } from "../errors/settings-error";
import { DocResponseWithId } from "../../infractructure/interfaces--/mongo.interface";
import { ELangs } from "@shared/enums/langs.enum";
import { UserSettings } from "../../infractructure/db/entities/schemas/user-settings-schema";
import { injectable } from "inversify";
import { IUserSettingsService } from "../repositories/UserSettingsRepository/UserSettingsRepository";

@injectable()
export class UserSettingsService implements IUserSettingsService {
  async getSettings(): Promise<UserSettings> {
    console.log("UserSettingService UserSettingService");
    const settings = (await UserSettingsModel.findOne({
      owner: "671eb1d9588c00c5a7fd91a5",
    })) as DocResponseWithId<UserSettings>;
    // userId: "671eb1d9588c00c5a7fd91a5",
    // const settings = (await SettingsModel.findById("674859d4b74a38938453c9b4")) as DocResponseWithId<ISettings>;
    console.log("<><><>", settings);

    if (!settings) {
      throw SettingsError.NotFound();
    }
    return settings;
  }

  // async createSetting(): Promise<DocResponseWithId<UserSettings>> {
  async createSetting(): Promise<UserSettings> {
    console.log("UserSettingService createSetting");
    // const settings = await SettingsModel.findOne({ userId: "671eb1d9588c00c5a7fd91a5" });
    const newDocument: UserSettings = {
      defaultLanguage: ELangs.EN,
      translationLanguage: ELangs.RU,
      interfaceLanguage: ELangs.EN,
    };
    // const res = (await newDocument.save()) as DocResponseWithId<ISettings<Types.ObjectId>>;
    const newSetCreated = (await UserSettingsModel.create(newDocument)).toObject(); // as unknown as DocResponseWithId<UserSettings>;//
    console.log("<><><res>", newSetCreated);
    // const settings = (await SettingsModel.findById("674859d4b74a38938453c9b4")) as DocResponseWithId<ISettings>;
    // console.log("<><><>", settings);

    if (!newSetCreated) {
      throw SettingsError.BadRequest("settings", "Settings save error");
    }
    const res: UserSettings = {
      id: newSetCreated._id.toString(),
      interfaceLanguage: newSetCreated.interfaceLanguage,
      defaultLanguage: newSetCreated.defaultLanguage,
      translationLanguage: newSetCreated.translationLanguage,
    };
    // if (!settings) {
    //   throw SettingsError.NotFound();
    // }
    return res;
  }

  async updateSettings(newSettings: Partial<UserSettings>): Promise<UserSettings> {
    const settings = (await UserSettingsModel.findOneAndUpdate({ owner: "671eb1d9588c00c5a7fd91a5" }, newSettings, {
      new: true,
    })) as DocResponseWithId<UserSettings>;
    if (!settings) {
      throw SettingsError.NotFound();
    }
    return settings;
  }
}
