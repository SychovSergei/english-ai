import mongoose from "mongoose";

import app from "./bin/app";
import config from "./config";

const dbConnect = async () => {
  try {
    const dbSource = config.mongo.db_source!;
    await mongoose.connect(dbSource);
    console.log("Connected to MongoDB success");
  } catch (e) {
    console.log("Error: connection to DB failed");
  }
};

const start = async () => {
  try {
    await dbConnect();

    const PORT = config.port;
    app.listen(PORT, () => console.log(`[server]: Server is running at PORT:${PORT}`));
  } catch (e) {
    console.log("Start() ERROR, e");
  }
};

start().catch((err) => console.log("err", err));
