import * as process from 'node:process';
import path from 'path';

import dotenv from 'dotenv';
import { injectable } from 'inversify';

import { ConfigServicePort } from '@core/application/ports';
import { IConfig } from '@core/application/ports/config/IConfig';

// import { IConfig, IConfigService } from '@application/ports/config-service.interface';

dotenv.config({ path: path.resolve(__dirname, '../../../', '.env') });

@injectable()
export class ConfigService implements ConfigServicePort {
  private readonly config: IConfig;

  constructor() {
    this.config = {
      port: this.getNumber('PORT'),
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
        accessKey: this.getEnvVar('JWT_SECRET_ACCESS'),
        accessKeyExpiresInSec: this.getNumber('ACCESS_TOKEN_LIFETIME_SEC'),
        refreshKey: this.getEnvVar('JWT_SECRET_REFRESH'),
        refreshKeyExpiresInSec: this.getNumber('REFRESH_TOKEN_LIFETIME_SEC'),
        jwtSecret: this.getEnvVar('JWT_SECRET_KEY'),
        expiresIn: this.getEnvVar('EXPIRES_IN'),
      },
      smtp: {
        host: this.getEnvVar('SMTP_HOST'),
        port: this.getNumber('SMTP_PORT'),
        user: this.getEnvVar('SMTP_USER'),
        password: this.getEnvVar('SMTP_PASSWORD'),
      },
      guest: {
        guestIdLifetimeSec: this.getNumber('GUEST_ID_LIFETIME_SEC'),
        maxWords: this.getNumber('GUEST_MAX_WORDS') ?? 33,
        maxTrainings: this.getNumber('GUEST_MAX_TRAININGS') ?? 55,
      },
      session: {
        update_time_threshold: this.getNumber('SESSION_UPDATE_THRESHOLD'),
      },
    };
  }

  getJwtSecret(): string {
    return this.config.jwt.jwtSecret;
  }

  private getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
  }

  private getNumber(name: string): number {
    const value = this.getEnvVar(name);
    const parsed = Number(value);

    if (Number.isNaN(parsed)) throw new Error(`Environment variable ${name} must be a number`);

    return parsed;
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
