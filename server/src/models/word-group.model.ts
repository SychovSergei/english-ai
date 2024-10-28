import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { IWordGroup } from "./interfaces/word-group.interface";

type WordGroupModel = Model<IWordGroup>;
const wordGroupSchema: Schema = new Schema<IWordGroup, WordGroupModel>({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  language: { type: String, required: true },
  shared: { type: Boolean, required: true },
  words: [
    {
      type: Schema.Types.ObjectId,
      ref: EDbModels.Word,
    },
  ],
});

const WordGroupModel: WordGroupModel = model<IWordGroup, WordGroupModel>(EDbModels.WordGroup, wordGroupSchema);

export default WordGroupModel;
