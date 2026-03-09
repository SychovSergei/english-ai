import { UserSettings } from '@core/domain/entities';

export interface IUserSettingsService {
  getSettings(id: string): Promise<UserSettings | null>;
  createSetting(): Promise<UserSettings>;
  updateSettings(newSettings: Partial<UserSettings>): Promise<UserSettings>;
}
