import newspaper from "./routes/newspaper.js";
import {Hono} from "hono"
import {cors} from "hono/cors"
import {serve} from "@hono/node-server"
import mongoose from "mongoose"

const app = new Hono();

app.use(cors());    

app.route("/newspapers", newspaper);


const port = process.env.PORT;
const uri = process.env.MONGODB_URL;

const connectToDatabase =  async () => {
    
    try {
        await mongoose.connect(uri, {
            serverApi: { version: "1", strict: true, deprecationErrors: true },
          });
    } catch (err) {
      console.log("Error", err);
    }
  };


await connectToDatabase()
console.log(`server started at ${port}`)
serve({
  fetch: app.fetch,
  port
})
