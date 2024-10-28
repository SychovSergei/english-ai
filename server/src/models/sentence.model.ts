import { model, Model, Schema, Types } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ISentence } from "./interfaces/sentence.interface";

type SentenceModel = Model<ISentence>;
const sentenceSchema: Schema = new Schema<ISentence, SentenceModel>({
  text: { type: String, required: true },
  translation: { type: String },
  wordGroupId: {
    type: Types.ObjectId,
    ref: EDbModels.WordGroup,
    required: true,
  },
  words: [
    {
      type: Types.ObjectId,
      ref: EDbModels.Word,
    },
  ],
});

const SentenceModel: SentenceModel = model<ISentence, SentenceModel>(EDbModels.Sentence, sentenceSchema);

export default SentenceModel;
