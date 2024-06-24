import mongoose from "mongoose";
import moment from "moment";
import newspaperSchema from "./newspaper.js";

const entrySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
    default: moment().format("YYYY-MM-DD"),
  },
  newspapers: {
    type: [newspaperSchema],
    required: true,
  },
});

//set what is returned when queried
entrySchema.set("toJSON", {
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
