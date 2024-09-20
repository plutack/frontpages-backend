import { v2 as cloudinary } from "cloudinary";
import moment from "moment";
import "dotenv/config";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image to cloudinary
export const uploadImg = async (newspaperName, imgLink) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(imgLink, {
      public_id: `${newspaperName}-${moment().format("DD-MM-YYYY")}`,
    });
    return secure_url;
  } catch (error) {
    console.error(error);
    return "";
  }
};
