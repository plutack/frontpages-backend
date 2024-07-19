import moment from "moment";
import mongoose from "mongoose";

const newspaperSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    default: moment().format("YYYY-MM-DD"),
  },
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

//set what is returned when queried
newspaperSchema.set("toJSON", {
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

const Newspaper = mongoose.model("Newspaper", newspaperSchema);

export default Newspaper;
