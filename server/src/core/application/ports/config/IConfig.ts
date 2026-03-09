export interface IConfig {
  port: number;
  mongo: IMongoConfig;
  openAi: IOpenAiConfig;
  api_url: string;
  common: ICommonConfig;
  session: ISessionConfig;
  jwt: IJwtConfig;
  smtp: ISMTPConfig;
  guest: {
    maxWords: number;
    maxTrainings: number;
    guestIdLifetimeSec: number;
  };
}

export interface ICommonConfig {
  client_url: string;
}

export interface ISessionConfig {
  update_time_threshold: number;
}

export interface IJwtConfig {
  accessKey: string;
  accessKeyExpiresInSec: number;
  refreshKey: string;
  refreshKeyExpiresInSec: number;
  jwtSecret: string;
  expiresIn: string;
}

export interface ISMTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface IMongoConfig {
  db_source: string;
}

export interface IOpenAiConfig {
  api_key: string;
}
