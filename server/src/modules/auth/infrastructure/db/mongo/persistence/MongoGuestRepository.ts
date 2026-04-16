import { Guest } from '@modules/auth/domain/entities/Guest';

import { GuestRepositoryPort } from '@modules/auth/application/ports/GuestRepositoryPort';

import { GuestModel } from '@modules/auth/infrastructure/db/mongo/models/GuestModel';

export class MongoGuestRepository implements GuestRepositoryPort {
  async save(guest: Guest): Promise<void> {
    await GuestModel.updateOne(
      { _id: guest.id },
      {
        $set: {
          fingerprint: guest.fingerprint,
          lastIp: guest.ip,
          createdAt: guest.createdAt,
        },
      },
      { upsert: true }, // Создаст, если нет, или обновит, если есть
    );
  }

  async create(guest: Guest): Promise<string | null> {
    const guestDoc = await GuestModel.create(guest);
    return guestDoc.id;
  }

  async findById(id: string): Promise<Guest | null> {
    const guestDoc = await GuestModel.findById(id);
    return guestDoc ? this.mapToDomain(guestDoc) : null;
  }

  async findByFingerprint(fp: string): Promise<Guest | null> {
    // Ищем последнюю созданную запись с таким отпечатком
    const guestDoc = await GuestModel.findOne({ fingerprint: fp }).sort({ createdAt: -1 });
    return guestDoc ? this.mapToDomain(guestDoc) : null;
  }

  private mapToDomain(guestDoc: any): Guest {
    return new Guest(
      {
        fingerprint: guestDoc.fingerprint,
        ip: guestDoc.lastIp,
        createdAt: guestDoc.createdAt,
      },
      guestDoc._id,
    );
  }
}
