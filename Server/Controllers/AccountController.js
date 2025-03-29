import { User } from "../Models/UserSchema.js";

const isPasswordStrong = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();
      return res.status(201).json({ msg: "User registered successfully" });
    }
  } catch (error) {
    console.error("Error in Register:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
