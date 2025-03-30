import { User } from "../Models/UserSchema.js";
import uploadHandler from "../Config/uploadHandler.js";

export const GetProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from the auth middleware

    // Find the user by ID and exclude the password field
    const user = await User.findById(userId).select("-password -OTP");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Checking if uploading image to cloudinary is working or not
export const UploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    const file = req.files.image;
    const imageUrl = await uploadHandler(file);

    res.status(200).send({
      message: "File uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
