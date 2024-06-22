import { v2 as cloudinary } from "cloudinary";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
export const uploadImg = async (newspaperName, imgLink) => {
  try {
    const cloudinaryLink = await cloudinary.uploader.upload(imgLink, {
      public_id: `${newspaperName}-${moment().format("DD-MM-YYYY")}`,
    });
    return cloudinaryLink;
  } catch (error) {
    console.log(error);
    return ''
  }
};

// console.log(uploadResult);

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url("shoes", {
//   crop: "auto",
//   gravity: "auto",
//   width: 500,
//   height: 500,
// });

// console.log(autoCropUrl);
