import { model, Schema } from 'mongoose';

const GuestUsageSchema = new Schema({
  guestId: { type: String, required: true, unique: true },
  wordCount: { type: Number, default: 0 },
});

export const GuestUsageModel = model('GuestUsage', GuestUsageSchema);
