import { model, Schema } from 'mongoose';

export interface GuestPersistence {
  _id: string;

  fingerprint: string;
  lastIp: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const GuestSchema = new Schema<GuestPersistence>(
  {
    _id: { type: String, required: true },
    fingerprint: { type: String, required: true, index: true },
    lastIp: { type: String },
    createdAt: { type: Date, required: true },
  },
  { _id: false, timestamps: true },
);

export const GuestModel = model('Guest', GuestSchema);
