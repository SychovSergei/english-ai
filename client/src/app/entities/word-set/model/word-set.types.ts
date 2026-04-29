import { WordId, WordMetadata } from '@entities/word';
import { WordSetSettings } from '@entities/word-set';
import { OwnerId } from '@shared/lib';

export interface WordSetProps {
  readonly title: string;
  readonly description: string;
  readonly ownerId: OwnerId;
  readonly wordIds: WordId[]; // Ссылки по ID
  readonly settings: WordSetSettings; // VO
  readonly metadata: WordMetadata; // Сеты тоже нужно синхронизировать!
  readonly updatedAt: number;
}
