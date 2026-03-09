import { Model, model, Schema } from 'mongoose';

import { EDbModels } from '@core/domain/enums/db-models.enum';

// TODO path
export interface ISharing {
  sharedBy: Schema.Types.ObjectId; // Кто поделился
  sharedWith: Schema.Types.ObjectId; // С кем поделились
  wordSet: Schema.Types.ObjectId; // Набор слов, которым поделились
  createdAt: Date; // Дата создания
}

type SharingModel = Model<ISharing>;
const sharingSchema: Schema = new Schema<ISharing, SharingModel>({
  sharedBy: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Кто поделился
  sharedWith: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // С кем поделились
  wordSet: { type: Schema.Types.ObjectId, ref: EDbModels.WordSet }, // Набор слов, которым поделились
  createdAt: { type: Date, default: Date.now }, // Дата создания
});

export const SharingModel: SharingModel = model<ISharing, SharingModel>(EDbModels.Sharing, sharingSchema);

// export default SharingModel;
