import express from "express";
import {
  createIssue,
  getAllIssues,
  getOneIssue,
} from "../Controllers/IssueController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.get("/", getAllIssues);
router.get("/:id", getOneIssue);
router.post("/", authMiddleware, createIssue);

export default router;
