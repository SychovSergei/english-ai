import { z } from 'zod';

import { ELangs, ELevels, ESource } from '@core/domain/enums';

/** It must be matched with Word interface
 *  It is the source for database properties */
export const sentenceSchema = z.object({
  text: z.string().length(24),
  linkedWords: z.array(z.string().length(24)),
  translations: z.array(
    z.object({
      lang: z.nativeEnum(ELangs),
      text: z.string().optional(),
    }),
  ),
  source: z.nativeEnum(ESource),
  difficultyLevel: z.nativeEnum(ELevels),
  createdAt: z.date(),
});
