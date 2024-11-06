import express, { Request, Response } from "express";
import { Express } from "express";
import cors, { CorsOptions } from "cors";

import router from "../routes/index";
import errorHandler from "../middlewares/error-handler.middleware";

const app: Express = express();

app.use(express.json());

const whiteList = ["http://localhost:4200"];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(<string>origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ApiError(500, "cors", "Not allowed by CORS", []));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

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
app.use(errorHandler as unknown as express.ErrorRequestHandler);

export default app;
