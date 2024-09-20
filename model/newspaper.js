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
  },
  link: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true
  }
});


// Add a compound index for date and name
newspaperSchema.index({ date: 1, name: 1 }, { unique: true });

//set what is returned when queried
newspaperSchema.set("toJSON", {
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

const Newspaper = mongoose.model("Newspaper", newspaperSchema);

export default Newspaper;