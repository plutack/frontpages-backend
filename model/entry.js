import mongoose from "mongoose";
import moment from "moment";
import newspaperSchema from "./newspaper.js";

const entrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    default: Date.now(),
  },
  newspapers: {
    type: [newspaperSchema],
    required: true,
  },
});

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
