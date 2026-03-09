import { z } from 'zod';

import { sentenceSchema } from '@core/domain/entities';
import { ELangs, ELevels, ESource } from '@core/domain/enums';

// TODO  ????? зачем интерфейс?
export interface ISentence<TWords = string> {
  text: string;
  linkedWords: TWords[];
  translations: {
    lang: ELangs;
    text: string;
  }[];
  source: ESource;
  difficultyLevel: ELevels;
  createdAt: Date;
}

export type Sentence = z.infer<typeof sentenceSchema>;

export type SentenceModel = z.infer<typeof sentenceSchema>;
