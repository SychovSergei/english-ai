import { WordItem, WordItemIsNew } from '@entities/word-set/models';

export function mapToWordItemIsNew(words: WordItem[]): WordItemIsNew[] {
  return words.map((word) => ({ ...word, isNew: true }));
}
