import express from "express";
import { SignUp, RequestOTP } from "../Controllers/AccountController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).send("Hello from account");
});
router.post("/signup", SignUp);
router.post("/request-otp", RequestOTP);

export default router;
