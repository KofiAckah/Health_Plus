import express from "express";
import {
  createHelpRequest,
  getHelpRequests,
  getOnlyOneHelpRequest,
  deleteHelpRequest,
} from "../Controllers/HelpController.js";

const router = express.Router();

router.post("/requests", createHelpRequest);
router.get("/requests", getHelpRequests);
router.get("/requests/:id", getOnlyOneHelpRequest);
router.delete("/requests/:id", deleteHelpRequest);

export default router;
