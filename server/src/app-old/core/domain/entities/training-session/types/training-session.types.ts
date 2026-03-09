import { z } from 'zod';

import { trainingSessionAnswerSchema, trainingSessionSchema } from '../schema/training-session.schema';

// export interface ITrainingSession {
//   user: Schema.Types.ObjectId;
//   task: Schema.Types.ObjectId;
//   answers: ITrainingSessionAnswer[];
//   completedAt: Date; // Дата завершения сессии
// }
export type TrainingSession = z.infer<typeof trainingSessionSchema>;

export type TrainingSessionModell = z.infer<typeof trainingSessionSchema>;

// export interface ITrainingSessionAnswer {
//   sentence: Schema.Types.ObjectId; // Предложение
//   userAnswer: string; // Ответ пользователя
//   isCorrect: boolean; // Правильность ответа
//   feedback: Schema.Types.ObjectId;
// }
export type TrainingSessionAnswer = z.infer<typeof trainingSessionAnswerSchema>;
