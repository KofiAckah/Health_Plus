import EmergencyCall from "../Models/EmergencyCallSchema.js";
import { User } from "../Models/UserSchema.js";
import Police from "../Models/PoliceSchema.js";
import FireHealth from "../Models/FireHealthSchema.js";

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
export const updateEmergencyCallStatusByPersonnel = async (req, res) => {
  try {
    const { callId } = req.params;
    const { status } = req.body;
    const personnelId = req.user.id;

    // Validate status
    if (!["pending", "active", "resolved"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    // Get the emergency call
    const call = await EmergencyCall.findById(callId);
    if (!call) {
      return res.status(404).json({ msg: "Emergency call not found" });
    }

    // Determine the personnel type (police, fire, health) from their JWT token
    let personnelType, personnelName, personnelRole;

    // Check if it's a police officer
    if (req.user.soNumber) {
      const officer = await Police.findById(personnelId);
      if (!officer) {
        return res.status(403).json({ msg: "Personnel not found" });
      }
      personnelType = "police";
      personnelName = officer.name;
      personnelRole = "Police Officer";
    } else {
      // It's a fire/health officer
      const fireHealthOfficer = await FireHealth.findById(personnelId);
      if (!fireHealthOfficer) {
        return res.status(403).json({ msg: "Personnel not found" });
      }
      personnelType = fireHealthOfficer.role;
      personnelName = fireHealthOfficer.name;
      personnelRole =
        personnelType === "fire" ? "Fire Officer" : "Health Officer";
    }

    // Validate that personnel can update this type of call
    const serviceMap = {
      police: "Police Service",
      fire: "Fire Service",
      health: "Ambulance Service",
    };

    const matchingService = serviceMap[personnelType];
    if (call.service !== matchingService) {
      return res.status(403).json({
        msg: `${personnelRole} is not authorized to update ${call.service} calls`,
      });
    }

    // Update the call
    const updatedCall = await EmergencyCall.findByIdAndUpdate(
      callId,
      {
        statusByPersonnel: status,
        lastUpdatedBy: {
          id: personnelId,
          name: personnelName,
          role: personnelRole,
        },
      },
      { new: true }
    ).populate("user", "name email phone");

    // Emit event to notify relevant parties
    const io = req.app.get("io");
    io.emit("emergency-call-updated", updatedCall);

    // If there's a user associated, emit specific event to that user
    if (updatedCall.user) {
      io.to(`user_${updatedCall.user._id}`).emit(
        "your-emergency-call-updated",
        updatedCall
      );
    }

    res.status(200).json({
      msg: "Emergency call status updated by personnel",
      call: updatedCall,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to update emergency call status",
      error: err.message,
    });
  }
};

// User changes the status of an emergency call (e.g., marking it resolved)
export const updateEmergencyCallStatusByUser = async (req, res) => {
  try {
    const { callId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "active", "resolved"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    // Ensure user can only update their own calls
    const call = await EmergencyCall.findById(callId);
    if (!call) {
      return res.status(404).json({ msg: "Emergency call not found" });
    }

    // Check if user owns this call or if it was an anonymous call with matching phone
    const isOwner =
      (req.user && call.user && call.user.toString() === req.user.id) ||
      (call.phone && req.body.phone && call.phone === req.body.phone);

    if (!isOwner) {
      return res
        .status(403)
        .json({ msg: "Not authorized to update this call" });
    }

    // Update the call
    const updatedCall = await EmergencyCall.findByIdAndUpdate(
      callId,
      { statusByUser: status },
      { new: true }
    ).populate("user", "name email phone");

    // Emit event to notify personnel
    const io = req.app.get("io");
    io.emit("emergency-call-user-update", updatedCall);

    res.status(200).json({
      msg: "Emergency call status updated by user",
      call: updatedCall,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to update emergency call status",
      error: err.message,
    });
  }
};
