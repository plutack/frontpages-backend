import express from "express";
import apiRoute from "./routes/api.route.js";

const app = express();

app.use("/", apiRoute);

export default app;
