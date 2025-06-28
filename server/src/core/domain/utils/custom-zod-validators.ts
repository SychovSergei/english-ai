import { Types } from 'mongoose';
import { z } from 'zod';

export const CustomZodObjectId = z.union([
  z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
  z.instanceof(Types.ObjectId), // Поддержка ObjectId напрямую
]);
