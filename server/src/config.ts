import path from 'path';

import dotenv from 'dotenv';

const envPath = path.resolve(__dirname, '../', '.env');
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: envPath });
}

export const REFRESH_TOKEN_LIFETIME_SEC = 7 * 24 * 60 * 60; //2 * 24 * 60 * 60; // 7 дней в мс = 7 * 24 * 60 * 60
export const ACCESS_TOKEN_LIFETIME_SEC = 15 * 60 * 60;

const {
  PORT,
  OPENAI_API_KEY,
  DATABASE_SOURCE,
  API_URL,
  COMMON_CLIENT_URL,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
} = process.env;

const conf = {
  port: PORT,
  mongo: {
    db_source: DATABASE_SOURCE,
  },
  openAi: {
    api_key: OPENAI_API_KEY,
  },
  api_url: API_URL,
  common: {
    client_url: COMMON_CLIENT_URL,
  },
  jwt: {
    access_key: JWT_SECRET_ACCESS,
    refresh_key: JWT_SECRET_REFRESH,
  },
  smtp: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    password: SMTP_PASSWORD,
  },
};

export default conf;
