import mongoose from 'mongoose';

import app from './bin/app';
import config from './config';

/**
 * Подключение к MongoDB
 * @returns Promise<void>
 */
export const dbConnect = async () => {
  try {
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    const dbSource = config.mongo.db_source!;
    await mongoose.connect(dbSource);
    console.log('Connected to MongoDB success');
  } catch (e) {
    console.log('Error: connection to DB failed', e);
  }
};

/**
 * Запускает сервер
 * @returns Promise<void>
 */
export const start = async () => {
  try {
    await dbConnect();

    const PORT = config.port;
    app.listen(PORT, () => console.log(`[server]: Server is running at PORT:${PORT}`));
  } catch (e) {
    console.log('Start() ERROR, e', e);
  }
};

start().catch((err) => console.log('err', err));
