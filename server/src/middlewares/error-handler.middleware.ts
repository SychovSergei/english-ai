import { Request, Response, NextFunction } from "express";

import ApiErrors from "../errors/api-errors";

export default function errorHandler(error: Error | ApiErrors, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ApiErrors) {
    const { code, message, errors } = error;
    return res.status(error.status).json({ code, message, errors });
  }
  return res.status(500).json({ error: "internal-server-error", message: "Internal server error" });
}
