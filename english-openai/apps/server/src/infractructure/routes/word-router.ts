import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import { container } from "../di/inversify.config";
import { TYPES } from "../di/types";
import { WordController } from "../controllers/Word/word-controller";
import { CustomRequest } from "../interfaces--/custom-request.interface";

const wordController = container.get<WordController>(TYPES.WordController);

router.get("/", async (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log("getAll");
  await wordController.getAll(req, res, next);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  await wordController.create(req, res, next);
});

router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params);
  await wordController.checkWordExists(req, res, next);
});

router.get("/:wordId", async (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log("------------------------------------");
  const { wordId } = req.params;
  console.log("-------------", wordId, "-----------------------");
  try {
    await wordController.findWord(req, res, next);
  } catch (e) {
    console.log(e);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  await wordController.updateWord(req, res, next);
});

router.patch("/:id/add-translation", async (req: Request, res: Response, next: NextFunction) => {
  await wordController.addTranslation(req, res, next); //TODO проверить нужно ли мне :id в URL
});

export default router;
