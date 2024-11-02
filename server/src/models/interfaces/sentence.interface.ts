import { Types } from "mongoose";

export interface ISentence {
  text: string;
  translation: string;
  wordGroupId: Types.ObjectId | string;
  words: Types.ObjectId[] | string[];
}
