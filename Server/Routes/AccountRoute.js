import express from "express";
import { SignUp } from "../Controllers/AccountController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).send("Hello from account");
});
router.post("/signup", SignUp);

export default router;
