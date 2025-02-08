import { Schema } from "mongoose";

export interface ITrainingSession {
  user: Schema.Types.ObjectId;
  task: Schema.Types.ObjectId;
  answers: ITrainingSessionAnswer[];
  completedAt: Date; // Дата завершения сессии
}

export interface ITrainingSessionAnswer {
  sentence: Schema.Types.ObjectId; // Предложение
  userAnswer: string; // Ответ пользователя
  isCorrect: boolean; // Правильность ответа
  feedback: Schema.Types.ObjectId;
}
