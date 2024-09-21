import newspaper from "./routes/newspaper.js";
import {Hono} from "hono"
const app = new Hono();


app.use("/newspapers", newspaper);

export default app;
