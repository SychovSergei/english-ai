import { z } from 'zod';

import { CustomZodObjectId } from '@core/domain/utils';

export const trainingSessionAnswerSchema = z.object({
  sentence: CustomZodObjectId, // Предложение
  userAnswer: z.string(), // Ответ пользователя
  isCorrect: z.boolean(), // Правильность ответа
  feedback: CustomZodObjectId,
});
// export interface ITrainingSessionAnswer {
//   sentence: Schema.Types.ObjectId; // Предложение
//   userAnswer: string; // Ответ пользователя
//   isCorrect: boolean; // Правильность ответа
//   feedback: Schema.Types.ObjectId;
// }

export const trainingSessionSchema = z.object({
  id: CustomZodObjectId.optional(), // Идентификатор сессии
  user: CustomZodObjectId, // Идентификатор сессии
  task: CustomZodObjectId,
  answers: z.array(trainingSessionAnswerSchema).refine((arr) => arr.length > 0, {
    message: 'At least one answer is required',
  }), // Массив переводов// Ошибка, если массив пустой
  completedAt: z.date({ required_error: 'Creation date is required', invalid_type_error: 'Invalid date format' }), // Дата создания слова, // Дата завершения сессии
});
// export interface ITrainingSession {
//   user: Schema.Types.ObjectId;
//   task: Schema.Types.ObjectId;
//   answers: ITrainingSessionAnswer[];
//   completedAt: Date; // Дата завершения сессии
// }
