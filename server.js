import mongoose from "mongoose";
import app from "./index.js";
import job from "./cron/job.js";
import "dotenv/config";

const uri = process.env.MONGODB_URL;
const port = process.env.PORT;

try {
  await mongoose.connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });
  job.start();
  console.log("cron job started")
  app.listen(port, () => {
    console.log(`App started on port: ${port}`);
  });
} catch (error) {}
