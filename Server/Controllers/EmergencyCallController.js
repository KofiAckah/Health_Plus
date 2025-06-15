import EmergencyCall from "../Models/EmergencyCallSchema.js";
import { User } from "../Models/UserSchema.js";

// Called by mobile app when user taps emergency call
export const createEmergencyCall = async (req, res) => {
  try {
    const { service, location, name, phone } = req.body;
    let userId = null;
    if (req.user) userId = req.user.id;

    const call = new EmergencyCall({
      user: userId,
      name,
      phone,
      service,
      location,
    });
    await call.save();

    // Emit to all connected officer dashboards
    const io = req.app.get("io");
    io.emit("new-emergency-call", call);

    res.status(201).json({ msg: "Emergency call logged", call });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to log emergency call", error: err.message });
  }
};

// Officers dashboard: get all recent calls
export const getAllEmergencyCalls = async (req, res) => {
  try {
    const calls = await EmergencyCall.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");
    res.status(200).json(calls);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch calls", error: err.message });
  }
};

export const getCallsByService = async (req, res) => {
  try {
    const { service } = req.params;
    const calls = await EmergencyCall.find({ service })
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");

    res.status(200).json(calls);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch calls", error: err.message });
  }
};

// Officer changes the status of an emergency call
export const updateEmergencyCallStatus = async (req, res) => {
  try {
    const { callId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "active", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    // Find and update the call
    const call = await EmergencyCall.findById(callId);
    if (!call) {
      return res.status(404).json({ msg: "Emergency call not found" });
    }

    call.status = status;

    // Get officer info from req.user (set by authMiddleware)
    if (req.user) {
      call.lastUpdatedBy = {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
      };
    }

    await call.save();

    // Optionally, emit update to dashboards
    const io = req.app.get("io");
    io.emit("emergency-call-status-updated", {
      callId: call._id,
      status: call.status,
      officer: call.lastUpdatedBy,
    });

    res.status(200).json({ msg: "Status updated", call });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to update status", error: err.message });
  }
};
