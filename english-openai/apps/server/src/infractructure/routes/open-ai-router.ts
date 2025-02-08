import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import openAiController from "../controllers/open-ai-controller";

/**
 * POST /api/open-ai/generate-sentence
 * Request body: { word: string, level: string }
 */
router.post("/generate-sentences", async (req: Request, res: Response, next: NextFunction) => {
  await openAiController.generateSentence(req, res, next);
});

export default router;
