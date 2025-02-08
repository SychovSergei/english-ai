import { injectable } from "inversify";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../", ".env") });

@injectable()
export class ConfigService {
  private readonly config: Record<string, any>;

  constructor() {
    this.config = {
      port: process.env.PORT,
      mongo: {
        db_source: process.env.DATABASE_SOURCE,
      },
      openAi: {
        api_key: process.env.OPENAI_API_KEY,
      },
      api_url: process.env.API_URL,
      common: {
        client_url: process.env.COMMON_CLIENT_URL,
      },
      jwt: {
        access_key: process.env.JWT_SECRET_ACCESS,
        refresh_key: process.env.JWT_SECRET_REFRESH,
      },
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
      },
    };
  }

  get(key: string) {
    return this.config[key];
  }
}
