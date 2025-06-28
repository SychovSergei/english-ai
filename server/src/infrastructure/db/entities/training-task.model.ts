import { Model, model, Schema } from 'mongoose';

import { ELangs, ELevels, ETrainingType } from '@core/domain/enums';
import { EDbModels } from '@infrastructure/db/enums/db-models.enum';

// TODO path
export interface ITrainingTask {
  user: Schema.Types.ObjectId;
  type: ETrainingType;
  wordSet: Schema.Types.ObjectId;
  difficultyLevel: ELevels;
  language: ELangs;
  sentences: Schema.Types.ObjectId[];
  createdAt: Date;
}

type TrainingTaskModel = Model<ITrainingTask>;
const trainingTaskSchema: Schema = new Schema<ITrainingTask, TrainingTaskModel>({
  user: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Пользователь
  type: { type: String, enum: ETrainingType, required: true }, // Тип задания
  wordSet: { type: Schema.Types.ObjectId, ref: EDbModels.WordSet }, // Набор слов
  difficultyLevel: { type: String, enum: ELevels }, // Уровень сложности
  language: { type: String, required: true }, // Язык перевода, выбранный пользователем
  sentences: [{ type: Schema.Types.ObjectId, ref: EDbModels.Sentence }], // Связанные предложения
  createdAt: { type: Date, default: Date.now }, // Дата создания
});

export const TrainingTaskModel: TrainingTaskModel = model<ITrainingTask, TrainingTaskModel>(
  EDbModels.TrainingTask,
  trainingTaskSchema,
);

// export default TrainingTaskModel;
