import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const policeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    soNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    // badgeNumber: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // rank: {
    //   type: String,
    //   default: "",
    // },
    // department: {
    //   type: String,
    //   default: "",
    // },
  },
  { timestamps: true }
);

// Hash password before saving
policeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

// Method to compare password
policeSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Police = mongoose.model("Police", policeSchema);
export default Police;
