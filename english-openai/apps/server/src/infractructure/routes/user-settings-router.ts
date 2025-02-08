import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import { container } from "../di/inversify.config";
import { TYPES } from "../di/types";
import { UserSettingsController } from "../controllers/user-settings-controller";

const userSettingsController = container.get<UserSettingsController>(TYPES.UserSettingsController);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  await userSettingsController.getSettings(req, res, next);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  await userSettingsController.createSettings(req, res, next);
});

router.put("/", userSettingsController.updateSettings);

export default router;
