import express from "express";
import {
  createIssue,
  getAllIssues,
  getOneIssue,
  reactToIssue,
  addComment,
  updateIssue,
  deleteIssue,
  getUserIssues,
} from "../Controllers/IssueController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.get("/", getAllIssues);
router.get("/:id", getOneIssue);
router.post("/", authMiddleware, createIssue);
router.post("/:id/react", authMiddleware, reactToIssue);
router.post("/:id/comment", authMiddleware, addComment);
router.put("/:id", authMiddleware, updateIssue);
router.delete("/:id", authMiddleware, deleteIssue);
router.get("/user/posts", authMiddleware, getUserIssues);

export default router;
