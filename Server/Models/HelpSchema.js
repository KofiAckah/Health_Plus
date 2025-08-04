import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Help", helpSchema);
