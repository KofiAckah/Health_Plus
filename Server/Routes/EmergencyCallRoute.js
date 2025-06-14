import express from "express";
import {
  createEmergencyCall,
  getAllEmergencyCalls,
} from "../Controllers/EmergencyCallController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createEmergencyCall); // user must be logged in
router.post("/anonymous", createEmergencyCall); // allow anonymous (no auth)
router.get("/", getAllEmergencyCalls); // officers dashboard

export default router;
