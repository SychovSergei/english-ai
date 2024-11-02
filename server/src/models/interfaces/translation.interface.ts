import { Types } from "mongoose";
import { ELangs } from "../../enums/langs.enum";

export interface ITranslation {
  language: ELangs;
  wordId: Types.ObjectId | string; // origin word id
  translatedText: string;
  description?: string;
}
