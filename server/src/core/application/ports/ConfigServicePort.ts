import { IConfig } from '@core/application/ports/config/IConfig';

export interface ConfigServicePort {
  get<T extends keyof IConfig>(key: T): IConfig[T];
}
