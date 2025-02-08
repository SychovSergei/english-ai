import { ELevels } from "@shared/enums/levels.enum";
import { ESource } from "@shared/enums/source.enum";
import { ELangs } from "@shared/enums/langs.enum";

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
