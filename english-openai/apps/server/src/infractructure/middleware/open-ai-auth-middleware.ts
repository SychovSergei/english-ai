// import { Request, Response, NextFunction } from "express";
// import config from "../config";
//
// /**
//  * Middleware for adding OpenAI token to request to /api/open-ai/*
//  */
// export const openAiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const openAiToken = config.openAi.api_key;
//
//   if (!openAiToken) {
//     return res.status(500).json({ message: "OpenAI API key is not configured." });
//   }
//
//   req.headers["Authorization"] = `Bearer ${openAiToken}`;
//
//   next();
// };
