import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECERT,
});

const options = {
  folder: "Health-Plus", // The name of the folder in Cloudinary
  allowed_formats: ["jpg", "png", "jpeg"],
  unique_filename: true,
  use_filename: true,
};

export async function uploadImage(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
    // return result.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

export default cloudinary;
