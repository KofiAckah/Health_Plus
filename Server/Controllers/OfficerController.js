import Police from "../Models/PoliceSchema.js";
import FireHealth from "../Models/FireHealthSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const policeSignup = async (req, res) => {
  try {
    const { name, email, soNumber, password } = req.body;

    if (!name || !email || !soNumber || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Check if officer already exists
    const existingOfficer = await Police.findOne({ soNumber });
    if (existingOfficer) {
      return res.status(400).json({ msg: "Officer already exists." });
    }

    // Do NOT hash password here, let the schema handle it!
    const officer = new Police({
      name,
      email,
      password, // plain password, will be hashed by pre-save hook
      soNumber,
    });

    await officer.save();

    res.status(201).json({ msg: "Officer registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

export const policeLogin = async (req, res) => {
  try {
    const { soNumber, password } = req.body;

    if (!soNumber || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Find officer by soNumber
    const officer = await Police.findOne({ soNumber });
    if (!officer) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: officer._id, soNumber: officer.soNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      msg: "Login successful.",
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        soNumber: officer.soNumber,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};
export const officerLogout = async (req, res) => {
  try {
    // Clear the JWT token from the client side
    res.clearCookie("token");
    res.status(200).json({ msg: "Officer logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

export const policeProfile = async (req, res) => {
  try {
    const officerId = req.user.id; // <-- use JWT payload

    // Find officer by ID
    const officer = await Police.findById(officerId).select("-password");
    if (!officer) {
      return res.status(404).json({ msg: "Officer not found." });
    }

    res.status(200).json(officer);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

export const fireHealthSignup = async (req, res) => {
  try {
    const { name, email, soNumber, password, role } = req.body;

    if (!name || !email || !soNumber || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Check if officer already exists
    const existingOfficer = await FireHealth.findOne({ soNumber });
    if (existingOfficer) {
      return res.status(400).json({ msg: "Officer already exists." });
    }

    // Do NOT hash password here, let the schema handle it!
    const officer = new FireHealth({
      name,
      email,
      password, // plain password, will be hashed by pre-save hook
      soNumber,
      role, // optional, can be used to differentiate roles in FireHealth
    });

    await officer.save();

    res.status(201).json({ msg: "Officer registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

export const fireHealthLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Find officer by soNumber
    const officer = await FireHealth.findOne({ email });
    if (!officer) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: officer._id, email: officer.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      msg: "Login successful.",
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        soNumber: officer.soNumber,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

export const fireHealthLoginWithPhone = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Find officer by phone
    const officer = await FireHealth.findOne({ phone });
    if (!officer) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: officer._id, phone: officer.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      msg: "Login successful.",
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        soNumber: officer.soNumber,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

export const fireHealthProfile = async (req, res) => {
  try {
    const officerId = req.user.id; // <-- use JWT payload

    // Find officer by ID
    const officer = await FireHealth.findById(officerId).select("-password");
    if (!officer) {
      return res.status(404).json({ msg: "Officer not found." });
    }

    res.status(200).json(officer);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};

export const fireHealthLogout = async (req, res) => {
  try {
    // Clear the JWT token from the client side
    res.clearCookie("token");
    res.status(200).json({ msg: "Officer logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ msg: "Server error." });
  }
};
