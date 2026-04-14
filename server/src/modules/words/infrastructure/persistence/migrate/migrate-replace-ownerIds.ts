import process from 'node:process';
import { randomUUID } from 'crypto';
import path from 'path';

import * as dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';

import { WordPersistence } from '@modules/words/infrastructure/db/mongoose/Word.schema';
import { WordDocument, WordModel } from '@modules/words/infrastructure/persistence/models/WordModel';

function generate32Hex(): string {
  return randomUUID().toString().replace(/-/g, '');
  // return uuidv4().toString().replace(/-/g, '');
}

dotenv.config({ path: path.resolve(__dirname, '../../../../../../', '.env') });

async function migrateWordOwnerIds() {
  const dbSource = process.env['DATABASE_SOURCE'];
  console.log(dbSource);
  if (!dbSource) throw new Error('Missing required environment variable: DATABASE_SOURCE');

  try {
    await mongoose.connect(dbSource);
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB Words not found');
    const collection = db.collection('words');

    console.log('--- Starting Migration ---');

    const regExp = /^[0-9a-f]{24}$/;
    // const cursor = await collection.find({ text: { $exists: true } });
    // const oldDocs = await cursor.toArray();
    const oldDocs = await WordModel.find({
      // $and: [{ _id: { $type: 'string' } }, { _id: { $regex: regExp } }],
      $and: [
        // { ownerId: { $type: 'string' } },
        // { ownerId: { $regex: regExp } },
        // { ownerId: { $ne: 'e1dc1a32f0ea4c46baffffd335f30424' } },
        { ownerId: '723394f91afc40a681f1142b4d3bdc00' },
      ],
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
        // const newId = generate32Hex();
        // const newOwnerId = 'e1dc1a32f0ea4c46baffffd335f30424';

        const oldData = oldDoc.toObject();

        // // const ids = ['6766a93bc5a06b200add0d51'];
        // // if (ids.includes(oldData._id.toString())) {
        // const newTranslations = oldData.translations.map((t) => ({
        //   // _id: generate32Hex(),
        //   _id: t._id,
        //   value: t.value,
        //   language: t.language,
        //   description: t.description,
        //   difficultyLevel: t.difficultyLevel,
        //   lexicalCategory: t.lexicalCategory,
        //   image: t.image,
        //   createdAt: t.createdAt,
        //   updatedAt: t.updatedAt,
        // }));
        //
        // const migratedData: WordPersistence = {
        //   ownerId: newOwnerId,
        //   ownerKind: oldData.ownerKind,
        //   value: oldData.value,
        //   sense: oldData.sense,
        //   language: oldData.language,
        //   image: oldData.image,
        //   isPublic: oldData.isPublic,
        //   createdAt: oldData.createdAt,
        //   updatedAt: oldData.updatedAt,
        //   _id: oldData._id,
        //   translations: newTranslations,
        // };
        //
        // await WordModel.deleteOne({ _id: oldId });
        // await WordModel.collection.insertOne(migratedData as any);

        console.log(`✅ Migrated: [${oldData.value}] (ID: ${oldId}) - ${oldData.ownerId} - ${oldData.ownerKind}`);
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

migrateWordOwnerIds()
  .then(() => {
    console.log('Migration successfully completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed with error:', err);
    process.exit(1);
  });
