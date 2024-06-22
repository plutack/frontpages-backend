import mongoose from "mongoose";
import moment from "moment";
import { newspaperSchema } from "./newspaper.js";

const entrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    default: moment().format("MMMM Do YYYY"),
  },
  newspapers: {
    type: [newspaperSchema],
    required: true,
  },
});

const Newspaper = mongoose.model("Newspaper", newspaperSchema);

export default Newspaper;
