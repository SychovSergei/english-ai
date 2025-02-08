import { model, Model, Schema } from "mongoose";
import { EDbModels } from "../enums/db-models.enum";
import { ELevels } from "@shared/enums/levels.enum";
import { ITrainingTask } from "@shared/interfaces/training-task.interface";
import { ETrainingType } from "../../../core/enums/training-type.enum";

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

const TrainingTaskModel: TrainingTaskModel = model<ITrainingTask, TrainingTaskModel>(
  EDbModels.TrainingTask,
  trainingTaskSchema,
);

export default TrainingTaskModel;
