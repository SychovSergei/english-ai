import { Schema } from "mongoose";

export interface IWordSet {
  name: string;
  description: string;
  owner: Schema.Types.ObjectId;
  words: Schema.Types.ObjectId[];
  sharedWith: Schema.Types.ObjectId[];
  createdAt: Date;
}
