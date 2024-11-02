import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import wordController from "../controllers/word-controller";

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  await wordController.getAll(req, res, next);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  await wordController.create(req, res, next);
});

export default router;
