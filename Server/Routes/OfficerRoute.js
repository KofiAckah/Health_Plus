import express from "express";
import {
  officerLogin,
  officerSignup,
  officerLogout,
  officerProfile,
} from "../Controllers/OfficerController.js";

import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.post("/signup", officerSignup);
router.post("/login", officerLogin);
router.get("/profile", authMiddleware, officerProfile);
router.post("/logout", authMiddleware, officerLogout);

export default router;
