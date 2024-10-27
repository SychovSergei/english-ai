import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../", ".env");
dotenv.config({ path: envPath });

const { PORT, OPENAI_API_KEY } = process.env;

const conf = {
    port: PORT,
    openAi: {
        api_key: OPENAI_API_KEY,
    }
};

export default conf;
