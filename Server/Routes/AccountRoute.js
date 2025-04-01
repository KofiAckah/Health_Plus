import express from "express";
import {
  SignUp,
  RequestOTP,
  VerifyOTP,
  ForgotPassword,
  ResetPassword,
  Login,
  Logout,
} from "../Controllers/AccountController.js";
// import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).send("Hello from account");
});
router.post("/signup", SignUp);
router.post("/request-otp", RequestOTP);
router.post("/verify-otp", VerifyOTP);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);
router.post("/login", Login);
router.get("/logout", Logout);

export default router;
