import * as process from 'node:process';
import path from 'path';

import dotenv from 'dotenv';
import { injectable } from 'inversify';

import { IConfig, IConfigService } from '@application/ports/config-service.interface';

dotenv.config({ path: path.resolve(__dirname, '../../../', '.env') });

@injectable()
export class ConfigService implements IConfigService {
  private readonly config: IConfig;

  constructor() {
    this.config = {
      port: this.getEnvVar('PORT'),
      mongo: {
        db_source: this.getEnvVar('DATABASE_SOURCE'),
      },
      openAi: {
        api_key: this.getEnvVar('OPENAI_API_KEY'),
      },
      api_url: this.getEnvVar('API_URL'),
      common: {
        client_url: this.getEnvVar('COMMON_CLIENT_URL'),
      },
      jwt: {
        access_key: this.getEnvVar('JWT_SECRET_ACCESS'),
        refresh_key: this.getEnvVar('JWT_SECRET_REFRESH'),
      },
      smtp: {
        host: this.getEnvVar('SMTP_HOST'),
        port: this.getEnvVar('SMTP_PORT'),
        user: this.getEnvVar('SMTP_USER'),
        password: this.getEnvVar('SMTP_PASSWORD'),
      },
    };
  }

  private getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
  }

  /**
   * Get the configuration value by key
   * @param key The key to retrieve from the configuration
   * @returns The configuration value
   */
  get<T extends keyof IConfig>(key: T): IConfig[T] {
    return this.config[key];
  }
}
