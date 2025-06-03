import express from "express";
import {
  createIssue,
  getAllIssues,
  getOneIssue,
  reactToIssue,
  addComment,
} from "../Controllers/IssueController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.get("/", getAllIssues);
router.get("/:id", getOneIssue);
router.post("/", authMiddleware, createIssue);
router.post("/:id/react", authMiddleware, reactToIssue);
router.post("/:id/comment", authMiddleware, addComment);

export default router;
