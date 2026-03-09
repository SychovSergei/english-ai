import { UserSettings } from '@core/domain/entities';

export interface IUserSettingsRepository {
  findById(id: string): Promise<UserSettings | null>;
  createSettings(newDocument: UserSettings): Promise<UserSettings | null>;
  updateSettings(newSettings: UserSettings): Promise<UserSettings | null>;
}
