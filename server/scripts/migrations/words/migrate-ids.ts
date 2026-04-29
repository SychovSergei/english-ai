import process from 'node:process';
import path from 'path';

import * as dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, '../../../../../../', '.env') });

async function migrateWords(): Promise<void> {
  const dbSource = process.env['DATABASE_SOURCE'];
  console.log(dbSource);
  if (!dbSource) throw new Error('Missing required environment variable: DATABASE_SOURCE');

  try {
    await mongoose.connect(dbSource);
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB Words not found');
    const collection = db.collection('words'); //await db.collection('words');

    // console.log('--- Managing Indexes ---');
    // // 1. Удаляем старый индекс, который мешает (если он есть)
    // try {
    //   await collection.dropIndex('text_1');
    //   console.log('✅ Old index "text_1" dropped');
    // } catch (e) {
    //   console.log('ℹ️ Old index "text_1" not found, skipping drop');
    // }
    // // 2. Создаем новый составной уникальный индекс
    // await collection.createIndex({ value: 1, ownerId: 1, sense: 1 }, { unique: true, name: 'unique_word_sense' });
    // console.log('✅ New composite index "unique_word_sense" created');

    console.log('--- Starting Migration ---');

    const cursor = await collection.find({ text: { $exists: true } });
    const oldDocs = await cursor.toArray();

    console.log(`Found ${oldDocs.length} documents to migrate.`);

    if (oldDocs.length === 0) {
      console.log('✨ No documents need migration.');
      return;
    }

    let count: number = 0;

    for (const oldDoc of oldDocs as any[]) {
      try {
        // const ids = ['6766a93bc5a06b200add0d51', '6766ba97c5a06b200add0d9e', '6766bae1c5a06b200add0daa'];
        // if (ids.includes(oldDoc._id.toString())) {
        const newId = oldDoc._id.toString();
        // const newOwnerId = oldDoc.owner.toString();

        // console.log('oldDoc.translations =', oldDoc.translations);
        const newTranslations = (oldDoc.translations || []).map((t: any) => ({
          _id: t._id ? t._id.toString() : new Types.ObjectId().toString(),
          // _id: t._id.toString(),
          value: t.text || '', // text -> value
          language: t.language || 'en',
          description: t.description || '',
          difficultyLevel: t.difficultyLevel || undefined,
          lexicalCategory: t.lexicalCategory || undefined,
          image: t.image ?? null, // Пустое поле для картинки
          createdAt: oldDoc.createdAt || new Date(),
          updatedAt: oldDoc.updatedAt || new Date(),
        }));

        const migratedData: any = {
          _id: newId,
          ownerId: oldDoc.owner ? oldDoc.owner.toString() : oldDoc.ownerId || 'system',
          ownerKind: oldDoc.ownerKind || 'user',
          value: oldDoc.text || '',
          sense: null, // Новое поле для омонимов
          language: oldDoc.language || 'en',
          image: oldDoc.image ?? null, // Пустое поле для картинки
          translations: newTranslations,
          isPublic: oldDoc.isPublic ?? false,
          createdAt: oldDoc.createdAt || new Date(),
          updatedAt: oldDoc.updatedAt || new Date(),
        };

        console.log(oldDoc._id, '->', newId);
        // console.log(oldDoc.owner, '->', newOwnerId);

        await collection.deleteOne({ _id: oldDoc._id });
        await collection.insertOne(migratedData);

        console.log(`✅ Migrated: [${oldDoc.text}] (ID: ${newId})`);
        count = count + 1;
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

console.log('Script started...'); // Добавьте этот лог для проверки

migrateWords()
  .then(() => {
    console.log('Migration successfully completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed with error:', err);
    process.exit(1);
  });
