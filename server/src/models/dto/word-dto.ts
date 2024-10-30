import { z } from "zod";
import { WordRequestDtoSchema, WordTranslationSchema } from "../schemas/word-schemas";

export type IWordRequestDto = z.infer<typeof WordRequestDtoSchema>;
export type IWordTranslation = z.infer<typeof WordTranslationSchema>;

// class WordRequestDTO implements IWordRequestDto {
//   email: string;
//   originalText: string;
//   language: ELangs;
//
//   translations: [
//     {
//       language: ELangs;
//       translatedText: string;
//       description?: string;
//     },
//   ];
//
//   constructor(email: string, originalText: string, language: ELangs) {
//     this.email = email;
//     this.originalText = originalText;
//     this.language = language;
//   }
// }
