import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ISharing } from "@shared/interfaces/sharing.interface";

type SharingModel = Model<ISharing>;
const sharingSchema: Schema = new Schema<ISharing, SharingModel>({
  sharedBy: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Кто поделился
  sharedWith: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // С кем поделились
  wordSet: { type: Schema.Types.ObjectId, ref: EDbModels.WordSet }, // Набор слов, которым поделились
  createdAt: { type: Date, default: Date.now }, // Дата создания
});

const SharingModel: SharingModel = model<ISharing, SharingModel>(EDbModels.Sharing, sharingSchema);

export default SharingModel;
