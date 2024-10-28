import { model, Model, Schema, Types } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ITranslation } from "./interfaces/translation.interface";

type TranslationModel = Model<ITranslation>;
export const translationSchema: Schema = new Schema<ITranslation, TranslationModel>({
  language: { type: String, required: true },
  wordId: {
    type: Types.ObjectId,
    ref: EDbModels.Word,
    required: true,
  },
  translatedText: { type: String, required: true },
  description: { type: String },
});

const TranslationModel: TranslationModel = model<ITranslation, TranslationModel>(
  EDbModels.Translation,
  translationSchema,
);

export default TranslationModel;
