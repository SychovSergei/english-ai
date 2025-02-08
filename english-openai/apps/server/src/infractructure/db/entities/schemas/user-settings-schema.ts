import { z } from "zod";
import { ELangs } from "@shared/enums/langs.enum";
import { CustomZodObjectId } from "./custom-zod-validators";

/** It must be matched with ISettings interface
 *  It is the source for database properties */
export const userSettingsSchema = z.object({
  id: CustomZodObjectId.optional(),
  defaultLanguage: z.nativeEnum(ELangs), // Основной язык
  translationLanguage: z.nativeEnum(ELangs), // Язык для перевода
  interfaceLanguage: z.nativeEnum(ELangs), // Язык для перевода
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
