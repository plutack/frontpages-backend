import app from "./index.js";

const port = process.env.PORT;

const startServer =  () => {
  // console.log("Starting job");
  // job.start();
  try {
    app.listen(port, () => {
      console.log(`App started on port: ${port}`);
    });
  } catch (err) {
    console.log("Error", err.message);
  }
};

startServer();
