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
