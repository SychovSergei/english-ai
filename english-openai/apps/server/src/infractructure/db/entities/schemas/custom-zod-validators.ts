import { z } from "zod";
import { Types } from "mongoose";

export const CustomZodObjectId = z.union([
  z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  z.instanceof(Types.ObjectId), // Поддержка ObjectId напрямую
]);
