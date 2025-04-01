import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImage } from "../utils/cloundinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadHandler = async (file) => {
  const uploadDir = path.join(__dirname, "../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const uploadPath = path.join(uploadDir, file.name);
  await new Promise((resolve, reject) => {
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return reject(err);
      }
      resolve();
    });
  });

  const result = await uploadImage(uploadPath);
  fs.unlinkSync(uploadPath);
  return result;
};

export default uploadHandler;
