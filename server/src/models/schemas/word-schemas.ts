import { z } from "zod";
import { ELangs } from "../../enums/langs.enum";

export const WordTranslationSchema = z.object({
  language: z.nativeEnum(ELangs),
  translatedText: z.string().min(1, "Translated text is required"),
  description: z.string().optional(),
});

export const WordRequestDtoSchema = z.object({
  userId: z.string().length(24),
  originalText: z.string().min(1, "Original text is required"),
  language: z.nativeEnum(ELangs),
  translations: z.array(WordTranslationSchema),
});
