import mongoose from "mongoose";
import moment from "moment";
import Newspaper from "./newspaper.js";

const entrySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD"),
  },
  newspapers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Newspaper,
    required: true,
  },
});

//set what is returned when queried
entrySchema.set("toJSON", {
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return {
      id: ret.id,
      ...ret,
    };
  },
});

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
