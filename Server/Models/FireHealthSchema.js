import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const fireHealthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    soNumber: {
      type: Number,
      unique: true,
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["health", "fire"],
      default: "health",
    },
  },
  { timestamps: true }
);

fireHealthSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});
fireHealthSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const FireHealth = mongoose.model("FireHealth", fireHealthSchema);
export default FireHealth;
