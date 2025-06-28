export interface IConfig {
  //TODO куда интерфейс деть?
  port: string;
  mongo: {
    db_source: string;
  };
  openAi: {
    api_key: string;
  };
  api_url: string;
  common: {
    client_url: string;
  };
  jwt: {
    access_key: string;
    refresh_key: string;
  };
  smtp: {
    host: string;
    port: string;
    user: string;
    password: string;
  };
}

export interface IConfigService {
  get<T extends keyof IConfig>(key: T): IConfig[T];
}
