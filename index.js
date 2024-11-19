import newspaper from "./routes/newspaper.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import mongoose from "mongoose";
import Logger from "./utils/logger";

const log = Logger.child({module: "Hono Server"})

const app = new Hono();

app.use(cors());

app.route("/newspapers", newspaper);

const port = process.env.PORT;
const uri = process.env.MONGODB_URL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
  } catch (error) {
    log.error("failed to connect to the server", {error})
}};

await connectToDatabase();
console.log(`server started at ${port}`);
log.info("connercted to database succesfully", {port})
serve({
  fetch: app.fetch,
  port,
});
