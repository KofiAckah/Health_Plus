import express from "express";
import {
  createEmergencyCall,
  getAllEmergencyCalls,
  updateEmergencyCallStatus,
  getCallsByService,
} from "../Controllers/EmergencyCallController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createEmergencyCall); // user must be logged in
router.post("/anonymous", createEmergencyCall); // allow anonymous (no auth)
router.get("/", getAllEmergencyCalls); // officers dashboard
router.put("/:callId/status", authMiddleware, updateEmergencyCallStatus); // officer updates call status
router.get("/service/:service", getCallsByService); // get calls by service type

export default router;
