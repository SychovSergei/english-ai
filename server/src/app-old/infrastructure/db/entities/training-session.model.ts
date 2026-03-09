import { Model, model, Schema } from 'mongoose';

import { TrainingSession } from '@core/domain/entities';
import { EDbModels } from '@core/domain/enums/db-models.enum';

type TrainingSessionModel = Model<TrainingSession>;

const trainingSessionSchema: Schema = new Schema<TrainingSession, TrainingSessionModel>({
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

export const TrainingSessionModel: TrainingSessionModel = model<TrainingSession, TrainingSessionModel>(
  EDbModels.TrainingSession,
  trainingSessionSchema,
);

// export default TrainingSessionModel;
