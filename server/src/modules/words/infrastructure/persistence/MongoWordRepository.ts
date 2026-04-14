import { OwnerId } from '@core/domain/identity/OwnerId';
import { Word } from '@modules/words/domain/entities/Word';

import { WordRepository } from '@modules/words/application/ports/WordRepository';

import { WordMapper } from '@modules/words/infrastructure/http/mappers/WordMapper';
import { WordModel } from '@modules/words/infrastructure/persistence/models';

export class MongoWordRepository implements WordRepository {
  async findById(wordId: string): Promise<Word | null> {
    const doc = await WordModel.findById(wordId);
    return doc ? WordMapper.toDomain(doc) : null;
  }

  // async findAllByOwnerId(ownerId: OwnerId): Promise<Word[]> {
  async findAllByOwnerId(ownerId: OwnerId): Promise<Word[]> {
    // Владелец может быть либо User (ObjectId), либо Guest (UUID/String)
    // Но в вашей WordSchema ownerId объявлен как String. Это удобно для унификации.
    console.log('MongoWordRepository findAllByOwnerId(ownerId)', ownerId);
    // 1. Получаем документы из БД (Persistence Layer)
    const docs = await WordModel.find({ ownerId: ownerId.value });
    // 2. Превращаем их в Доменные сущности (через Mapper)
    const data = docs.map(WordMapper.toDomain);
    // 3. Превращаем Домен в DTO для отправки клиенту
    // const dataRes = data.map((word) => WordMapper.toDto(word));
    console.log('MongoWordRepository data.length=', data.length);
    return data; //dataRes;
  }

  async findAllByValueForActor(value: string, actorId: string): Promise<Word[]> {
    // async findAllByValueForActor(value: string): Promise<Word[]> {
    const docs = await WordModel.find({
      // value: {
      //   $regex: new RegExp(`^${value}$`, 'i'), // i - case insensitive (не чувствителен к регистру)
      // },
      value: value,
      ownerId: actorId,
    });

    return docs.map((doc) => WordMapper.toDomain(doc));
  }

  async save(word: Word): Promise<void> {
    // console.log('MongoWordRepository -> save -> word', JSON.stringify(word, null, 2));
    const persistence = WordMapper.toPersistence(word);
    // console.log('MongoWordRepository -> save -> persistence', JSON.stringify(persistence, null, 2));
    await WordModel.updateOne(
      { _id: persistence._id },
      {
        $set: persistence,
      },
      { upsert: true },
    );
    console.log('MongoWordRepository -> save -> SUCCESS');
  }

  async update(word: Word): Promise<void> {
    console.log('MongoWordRepository -> update -> word', JSON.stringify(word, null, 2));
    const persistence = WordMapper.toPersistence(word);
    console.log('MongoWordRepository -> update -> persistence', JSON.stringify(persistence, null, 2));
    const result = await WordModel.updateOne(
      { _id: persistence._id },
      {
        $set: persistence,
      },
      { upsert: false },
    );
    if (result.matchedCount === 0) {
      // Тут мы понимаем, что ничего не обновилось
      throw new Error('Word not found or access denied');
    }
    console.log('MongoWordRepository -> update -> SUCCESS');
  }

  async delete(wordId: string): Promise<string> {
    const res = await WordModel.deleteOne({ _id: wordId });
    console.log('Mongo delete res.deletedCount =', res.deletedCount);
    console.log('Mongo delete res.acknowledged =', res.acknowledged);
    return wordId;
  }
}
