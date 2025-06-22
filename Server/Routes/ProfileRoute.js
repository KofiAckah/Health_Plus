import express from "express";
import {
  GetProfile,
  UpdateProfile,
  // UploadImage,
} from "../Controllers/ProfileController.js";

import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, GetProfile);
router.put("/", authMiddleware, UpdateProfile);
// router.post("/upload", UploadImage);

export default router;
