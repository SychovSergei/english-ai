import { Router } from "express";
const router = Router();

import { authMiddleware } from "../middleware/auth-middleware";

import authRouter from "./auth-router";
import wordRouter from "./word-router";
import openAiRouter from "./open-ai-router";
import settingsRouter from "./user-settings-router";

router.use("/auth", authRouter);
router.use("/words", authMiddleware, wordRouter);
router.use("/open-ai", authMiddleware, openAiRouter);
router.use("/user-settings", authMiddleware, settingsRouter);

export default router;
