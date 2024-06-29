import app from "./index.js";
import "dotenv/config";


const port = process.env.PORT;

try {
  app.listen(port, () => {
    console.log(`App started on port: ${port}`);
  });
} catch (err) {
  console.log("Error", err);
}
