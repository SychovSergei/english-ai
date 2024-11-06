import { NextFunction, Request, Response } from "express";

import wordService from "../services/word.service";
import { IWordRequestDto } from "../models/dto/word-dto";
import { WordValidation } from "./word-validator";

export class WordController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const words = await wordService.getAll();

      return res.json(words);
    } catch (e) {
      return next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const wordValidatedData = WordValidation.validate<IWordRequestDto>(req.body);
      const word = await wordService.createNewWord(wordValidatedData);

      return res.json({ word: word });
    } catch (e) {
      return next(e);
    }
  }
}

export default new WordController();
