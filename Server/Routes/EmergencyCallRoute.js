import express from "express";
import {
  createEmergencyCall,
  getAllEmergencyCalls,
  getCallsByService,
  getCallsByUser,
  getEmergencyCallById,
  updateEmergencyCallStatusByPersonnel,
  updateEmergencyCallStatusByUser,
} from "../Controllers/EmergencyCallController.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createEmergencyCall); // user must be logged in
router.post("/anonymous", createEmergencyCall); // allow anonymous (no auth)
router.get("/", getAllEmergencyCalls); // officers dashboard
router.get("/service/:service", getCallsByService); // get calls by service type
router.get("/user", authMiddleware, getCallsByUser); // get calls by logged in user
router.put(
  "/:callId/status/personnel",
  authMiddleware,
  updateEmergencyCallStatusByPersonnel
); // officer updates status
router.put(
  "/:callId/status/user",
  authMiddleware,
  updateEmergencyCallStatusByUser
); // user updates status
router.get("/:callId", authMiddleware, getEmergencyCallById); // get specific call details

export default router;
