import express, { Request, Response, NextFunction } from "express";
import { Express } from "express";


const app: Express = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Server is working!");
});


export default app;
