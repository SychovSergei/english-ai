import process from 'node:process';
import { randomUUID } from 'crypto';
import path from 'path';

import * as dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import { UserModel, UserPersistence } from '@modules/auth/infrastructure/db/mongo/models/UserModel';

function generate32Hex(): string {
  return randomUUID().toString().replace(/-/g, '');
  // return uuidv4().toString().replace(/-/g, '');
}

dotenv.config({ path: path.resolve(__dirname, '../../../../../../', '.env') });

async function migrateUsers() {
  const dbSource = process.env['DATABASE_SOURCE'];
  console.log(dbSource);
  if (!dbSource) throw new Error('Missing required environment variable: DATABASE_SOURCE');

  try {
    await mongoose.connect(dbSource);
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB Words not found');
    const collection = db.collection('users');

    console.log('--- Starting Migration ---');

    const regExp = /^[0-9a-f]{24}$/;
    // const cursor = await collection.find({ text: { $exists: true } });
    // const oldDocs = await cursor.toArray();
    const oldDocs = await UserModel.find({
      $and: [{ _id: { $type: 'string' } }, { _id: { $regex: regExp } }],
    });
    // const oldDocs = await collection.find({
    //   $and: [{ _id: { $type: 'string' } }, { _id: { $regex: regExp } }],
    // });

    console.log(`Found ${oldDocs.length} documents to migrate.`);

    if (oldDocs.length === 0) {
      console.log('✨ No documents need migration.');
      return;
    }

    let count: number = 0;

    for (const oldDoc of oldDocs) {
      try {
        const oldId = oldDoc._id.toString();
        const newId = generate32Hex();

        const oldData = oldDoc.toObject();

        // const ids = ['6766a93bc5a06b200add0d51'];
        const migratedData: UserPersistence = {
          email: oldData.email,
          role: oldData.role,
          isActivated: oldData.isActivated,
          activationId: oldData.activationId,
          settingsId: oldData.settingsId,
          passwordHash: oldData.passwordHash,
          name: {
            firstName: oldData.name.firstName,
            lastName: oldData.name.lastName,
          },

          createdAt: oldData.createdAt,
          updatedAt: oldData.updatedAt,
          _id: newId,
        };

        await UserModel.deleteOne({ _id: oldId });
        await UserModel.collection.insertOne(migratedData as any);

        console.log(`✅ Migrated: [${oldData.email}] (Old ID: ${oldId} -> New ID: ${newId})`);
        count++;
        // } // END IF
      } catch (docError: any) {
        console.error(`Failed to migrate ${oldDoc._id}:`, docError.message);
      }
    }

    console.log('--- Migration Finished Successfully ---', count);
  } catch (error) {
    console.error('🔥 Critical migration error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

console.log('Script started...');

migrateUsers()
  .then(() => {
    console.log('Migration successfully completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed with error:', err);
    process.exit(1);
  });
