import express from "express";
import apiRoute from "./routes/api.route.js";
import cors from "cors";

const app = express();

app.use([express.static("public"), cors()]);

app.use("/", apiRoute);

export default app;
