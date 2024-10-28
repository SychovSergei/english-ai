import { Router } from "express";
const router = Router();

import wordRouter from "./word-router";

router.use("/words", wordRouter);

export default router;
