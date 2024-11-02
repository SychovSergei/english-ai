import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../", ".env");
dotenv.config({ path: envPath });

const { PORT, OPENAI_API_KEY, DATABASE_SOURCE } = process.env;

const conf = {
  port: PORT,
  mongo: {
    db_source: DATABASE_SOURCE,
  },
  openAi: {
    api_key: OPENAI_API_KEY,
  },
};

export default conf;
