import app from "./index.js";
import "dotenv/config";
import mongoose from "mongoose";

const port = process.env.PORT;
const uri = process.env.MONGODB_URL;

const startServer = async () => {
  await mongoose.connect(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });
  try {
    app.listen(port, () => {
      console.log(`App started on port: ${port}`);
    });
  } catch (err) {
    console.log("Error", err);
  }
};

await startServer();
