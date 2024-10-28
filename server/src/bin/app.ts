import express, { Request, Response } from "express";
import { Express } from "express";

import router from "../routes/index";
import errorHandler from "../middlewares/error-handler.middleware";

const app: Express = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

/** ALL ROUTES */
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is working!");
});

/** must be last middleware */
app.use(errorHandler as express.ErrorRequestHandler);

export default app;
