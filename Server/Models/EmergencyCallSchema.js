import mongoose from "mongoose";

const emergencyCallSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow anonymous
    },
    name: String, // fallback if not logged in
    phone: String, // fallback if not logged in
    service: {
      type: String,
      enum: ["Fire Service", "Police Service", "Ambulance Service"],
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "acknowledged", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const EmergencyCall = mongoose.model("EmergencyCall", emergencyCallSchema);
export default EmergencyCall;
