import { User } from "../Models/UserSchema.js";
import { isPasswordStrong, generateOTP } from "../Config/Default.js";
import { sendVerificationEmail, requestAnotherOTP } from "../Config/Mail.js";

export const SignUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        msg: "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }
    const OTP = generateOTP();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    } else {
      const newUser = new User({
        name,
        email,
        password,
        OTP,
      });
      await newUser.save();

      // Schedule OTP deletion after 10 minutes
      setTimeout(async () => {
        try {
          await User.updateOne({ email }, { $set: { OTP: null } });
          console.log(`OTP for ${email} has been deleted and set to null.`);
        } catch (error) {
          console.error(`Failed to delete OTP for ${email}:`, error);
        }
      }, 10 * 60 * 1000);

      // Send verification email
      // -------------------------------------
      // Uncomment the following line to send verification email since I am coding
      await sendVerificationEmail(email, OTP);
      // -------------------------------------
      return res.status(201).json({ msg: "User registered successfully" });
    }
  } catch (error) {
    console.error("Error in Register:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const RequestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const OTP = generateOTP();

    // Update OTP in the database
    await User.updateOne({ email }, { $set: { OTP } });

    // Schedule OTP deletion after 10 minutes
    setTimeout(async () => {
      try {
        await User.updateOne({ email }, { $set: { OTP: null } });
        console.log(`OTP for ${email} has been deleted and set to null.`);
      } catch (error) {
        console.error(`Failed to delete OTP for ${email}:`, error);
      }
    }, 10 * 60 * 1000);

    // Send verification email
    // -------------------------------------
    // Uncomment the following line to send verification email since I am coding
    await requestAnotherOTP(email, OTP);
    // -------------------------------------

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in RequestOTP:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
