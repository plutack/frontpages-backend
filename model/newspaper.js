import mongoose from "mongoose";

const newspaperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
  },
});

export default newspaperSchema;
