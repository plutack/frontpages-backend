import mongoose from "mongoose";

const newspaperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
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

export default newspaperSchema;
