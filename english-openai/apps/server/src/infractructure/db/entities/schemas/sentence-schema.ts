import { z } from "zod";
import { ELevels } from "@shared/enums/levels.enum";
import { ELangs } from "@shared/enums/langs.enum";
import { ESource } from "@shared/enums/source.enum";

/** It must be matched with IWord interface
 *  It is the source for database properties */
export const SentenceSchema = z.object({
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
