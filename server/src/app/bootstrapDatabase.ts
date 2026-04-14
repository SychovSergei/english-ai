import mongoose from 'mongoose';

import config from '../config';

export async function bootstrapDatabase(): Promise<void> {
  try {
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    const dbSource = config.mongo.db_source!;
    await mongoose.connect(dbSource);
    console.clear();
    console.log('Connected to MongoDB');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    throw e;
  }
}
