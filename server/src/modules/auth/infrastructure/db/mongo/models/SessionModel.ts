import { model, Schema } from 'mongoose';

import { EDbModels } from '@core/domain/enums/db-models.enum';

export interface SessionDocument {
  _id: string;
  userId: string;
  refreshToken: string;
  fingerprint: string; // Ключ идентификации устройства
  userAgent?: string; // Информация о браузере (Chrome, Safari...)
  ip?: string;

  expiresAt: Date;
  lastActive: Date;
}

const SessionSchema = new Schema<SessionDocument>({
  _id: { type: String, required: true },
  // ref: EDbModels.User,
  userId: { type: String, required: true, index: true }, // Индекс для быстрого поиска всех сессий юзера
  refreshToken: { type: String, required: true, unique: true },
  fingerprint: { type: String, required: true }, // Чтобы не плодить сессии на одном устройстве
  userAgent: String,
  ip: String,

  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL индекс: Mongo сам удалит документ, когда время выйдет
  lastActive: Date,
});

export const MongoSessionModel = model<SessionDocument>(EDbModels.Session, SessionSchema);
