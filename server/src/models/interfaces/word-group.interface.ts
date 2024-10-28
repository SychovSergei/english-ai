import { Types } from "mongoose";

export interface IWordGroup {
  name: string;
  userId: string;
  shared: boolean;
  words: Types.ObjectId[] | string[];
}
