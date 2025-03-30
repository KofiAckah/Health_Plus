import express from "express";
import {
  SignUp,
  RequestOTP,
  VerifyOTP,
  Login,
  Logout,
  dashboard,
} from "../Controllers/AccountController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).send("Hello from account");
});
router.post("/signup", SignUp);
router.post("/request-otp", RequestOTP);
router.post("/verify-otp", VerifyOTP);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/dashboard", dashboard);

export default router;
