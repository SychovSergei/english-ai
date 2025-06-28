import { Model, model, Schema } from 'mongoose';

import { UserRefreshTokenModel } from '@core/domain/entities';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

type TokensModel = Model<UserRefreshTokenModel>;

const tokenModelSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: EDbModels.User },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true },
);
tokenModelSchema.set('toObject', {
  transform: (_, ret) => {
    // ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const TokenModel: TokensModel = model<UserRefreshTokenModel, TokensModel>(EDbModels.Token, tokenModelSchema);

// export default TokenModel;
