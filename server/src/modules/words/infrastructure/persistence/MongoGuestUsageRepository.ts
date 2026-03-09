import { GuestUsageRepositoryPort } from '@modules/words/application/ports';

import { GuestUsageModel } from '@modules/words/infrastructure/persistence/models/GuestUsageModel';

export class MongoGuestUsageRepository implements GuestUsageRepositoryPort {
  async getWordCount(guestId: string): Promise<number> {
    const count = await GuestUsageModel.findOne({ guestId });
    return count?.wordCount ?? 0;
  }

  async incrementWordCount(guestId: string): Promise<void> {
    await GuestUsageModel.updateOne({ guestId }, { $inc: { wordCount: 1 } }, { upsert: true });
  }
}
