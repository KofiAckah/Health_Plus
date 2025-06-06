import express from "express";
import {
  policeLogin,
  policeSignup,
  officerLogout,
  policeProfile,
  fireHealthSignup,
  fireHealthLogin,
  fireHealthLoginWithPhone,
  fireHealthProfile,
  fireHealthLogout,
} from "../Controllers/OfficerController.js";

import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

// Police routes
router.post("/signup", policeSignup);
router.post("/login", policeLogin);
router.get("/profile", authMiddleware, policeProfile);
router.post("/logout", authMiddleware, officerLogout);

// FireHealth routes
router.post("/firehealth/signup", fireHealthSignup);
router.post("/firehealth/login", fireHealthLogin);
router.post("/firehealth/login-phone", fireHealthLoginWithPhone);
router.get("/firehealth/profile", authMiddleware, fireHealthProfile);
router.post("/firehealth/logout", authMiddleware, fireHealthLogout);

export default router;
