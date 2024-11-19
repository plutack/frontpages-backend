import { v2 as cloudinary } from "cloudinary";
import moment from "moment";
import "dotenv/config";
import Logger from "./logger.js";


const log = Logger.child({module: "Cloundinary functions"})

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImg = async (newspaperName, imgLink) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(imgLink, {
      public_id: `${newspaperName}-${moment().format("DD-MM-YYYY")}`,
    });
    return secure_url;
  } catch (error) {
    log.error("image upload failed", {error})
    return "";
  }
};
