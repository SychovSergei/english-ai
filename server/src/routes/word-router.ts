import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import wordController from "../controllers/word-controller";

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  await wordController.getAll(req, res, next);
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  await wordController.create(req, res, next);
});

export default router;
