import { User } from "../Models/UserSchema.js";
import { isPasswordStrong, generateOTP } from "../Config/Default.js";
import {
  sendVerificationEmail,
  requestAnotherOTP,
  sendPasswordResetEmail,
} from "../Config/Mail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
      // await sendVerificationEmail(email, OTP);
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
    // await requestAnotherOTP(email, OTP);
    // -------------------------------------

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in RequestOTP:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const VerifyOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;
    if (!email || !OTP) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Check if OTP is valid
    if (existingUser.OTP !== OTP) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Update user status to verified
    await User.updateOne({ email }, { $set: { isVerified: true, OTP: null } });

    return res.status(200).json({ msg: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in VerifyOTP:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const ForgotPassword = async (req, res) => {
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

    // Send password reset email
    // -------------------------------------
    // Uncomment the following line to send password reset email since I am coding
    // await sendPasswordResetEmail(email, OTP);
    // -------------------------------------

    return res.status(200).json({ msg: "Password reset email sent" });
  } catch (error) {
    console.error("Error in ForgotPassword:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { email, OTP, newPassword, confirmPassword } = req.body;
    if (!email || !OTP || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Check if OTP is valid
    if (existingUser.OTP !== OTP) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({
        msg: "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await User.updateOne(
      { email },
      { $set: { password: hashedPassword, OTP: null } }
    );

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Error in ResetPassword:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Check if user is verified
    if (!existingUser.isVerified) {
      return res.status(400).json({ msg: "User is not verified" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
    });

    return res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.error("Error in Login:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Error in Logout:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
