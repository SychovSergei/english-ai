import { Schema } from "mongoose";

export interface ISharing {
  sharedBy: Schema.Types.ObjectId; // Кто поделился
  sharedWith: Schema.Types.ObjectId; // С кем поделились
  wordSet: Schema.Types.ObjectId; // Набор слов, которым поделились
  createdAt: Date; // Дата создания
}
