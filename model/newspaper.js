import mongoose from "mongoose";

export const newspaperSchema = new mongoose.Schema({
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

const Newspaper = mongoose.model("Newspaper", newspaperSchema);

export default Newspaper;
