import { EDbModels } from "../enums/db-models.enum";
import { ITrainingSession } from "@shared/interfaces/training-session.interface";
import { model, Model, Schema } from "mongoose";

type TrainingSessionModel = Model<ITrainingSession>;
const trainingSessionSchema: Schema = new Schema<ITrainingSession, TrainingSessionModel>({
  user: { type: Schema.Types.ObjectId, ref: EDbModels.User, required: true }, // Пользователь
  task: { type: Schema.Types.ObjectId, ref: EDbModels.TrainingTask, required: true }, // Связанное задание
  answers: [
    {
      sentence: { type: Schema.Types.ObjectId, ref: EDbModels.Sentence }, // Предложение
      userAnswer: { type: String, required: true }, // Ответ пользователя
      isCorrect: { type: Boolean, required: true }, // Правильность ответа
      feedback: { type: Schema.Types.ObjectId, ref: EDbModels.SentenceCheck }, // Рекомендации/проверка
    },
  ],
  completedAt: { type: Date, default: Date.now }, // Дата завершения сессии
});

const TrainingSessionModel: TrainingSessionModel = model<ITrainingSession, TrainingSessionModel>(
  EDbModels.TrainingSession,
  trainingSessionSchema,
);

export default TrainingSessionModel;
