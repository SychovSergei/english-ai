import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import { AuthController } from "../controllers/auth-controller";
import { container } from "../di/inversify.config";
import { TYPES } from "../di/types";
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/registration", async (req: Request, res: Response, next: NextFunction) => {
  await authController.registration(req, res, next);
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  await authController.login(req, res, next);
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  await authController.logout(req, res, next);
});

router.get("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  await authController.refresh(req, res, next);
});

export default router;
