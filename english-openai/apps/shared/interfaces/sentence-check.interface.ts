import { Schema } from "mongoose";

export interface ISentenceCheck {
  sentence: Schema.Types.ObjectId; // Проверяемое предложение
  userAnswer: string; // Ответ пользователя
  isCorrect: boolean; // Правильность
  hints: string[]; // Подсказки для исправления
  corrections: string; // Исправленный текст
  rulesViolated: string[]; // Нарушенные правила
  checkedAt: Date; // Дата проверки
}
