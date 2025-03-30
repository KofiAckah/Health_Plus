import express from "express";
import {
  GetProfile,
  // UpdateProfile,
  UploadImage,
  // ChangePassword,
} from "../Controllers/ProfileController.js";

import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, GetProfile);
router.post("/upload", UploadImage);
// router.put("/", authMiddleware, UpdateProfile);

export default router;
