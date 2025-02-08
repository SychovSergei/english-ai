import { NextFunction, Request, Response } from "express";

import openAiService from "../../core/services/open-ai.service";

export class OpenAiController {
  /**
   * POST /api/generate-sentence
   * Request body: { word: string, level: string }
   */
  async generateSentence(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { words, level, originLanguage, languages } = req.body; //TODO check consts
      if (!words || !level || !originLanguage || !languages) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const sentences = await openAiService.generateSentence(words, level, originLanguage, languages);
      console.log("result sentences", sentences);
      return res.json(sentences);
    } catch (e) {
      return next(e);
    }
  }
}

export default new OpenAiController();
