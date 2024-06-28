import mongoose from "mongoose";
import app from "./index.js";
import "dotenv/config";

const uri = process.env.MONGODB_URL;
const port = process.env.PORT;

try {
  await mongoose.connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });
  console.log("cron job started");
  app.listen(port, () => {
    console.log(`App started on port: ${port}`);
  });
} catch (err) {
  console.log("Error", err);
}
