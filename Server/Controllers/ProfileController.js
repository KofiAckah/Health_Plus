import { User } from "../Models/UserSchema.js";
import uploadHandler from "../Config/uploadHandler.js";
import { deleteImage } from "../utils/cloundinary.js";

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

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID from the auth middleware

    // Find the user by ID and exclude sensitive fields
    const user = await User.findById(userId).select("-password -OTP -__v");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const {
      name,
      phone,
      gender,
      location,
      hometown,
      dateOfBirth,
      occupation,
      bloodGroup,
      bio,
      removeProfilePicture,
    } = req.body;

    // Update fields, keeping existing values if not provided
    user.name = name !== undefined ? name : user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.gender = gender !== undefined ? gender : user.gender;
    user.location = location !== undefined ? location : user.location;
    user.hometown = hometown !== undefined ? hometown : user.hometown;
    user.dateOfBirth =
      dateOfBirth !== undefined ? dateOfBirth : user.dateOfBirth;
    user.occupation = occupation !== undefined ? occupation : user.occupation;
    user.bloodGroup = bloodGroup !== undefined ? bloodGroup : user.bloodGroup;
    user.bio = bio !== undefined ? bio : user.bio;

    // Handle profile picture removal
    if (removeProfilePicture === "true") {
      if (user.profilePictureId) {
        try {
          await deleteImage(user.profilePictureId); // Delete the old image from Cloudinary
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
        }
      }
      user.profilePicture = ""; // Set profile picture to empty
      user.profilePictureId = ""; // Clear the Cloudinary public ID
    }

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      const profilePicture = req.files.profilePicture;

      // Delete the old profile picture from Cloudinary if it exists
      if (user.profilePictureId) {
        try {
          await deleteImage(user.profilePictureId); // Use the stored publicId to delete the old image
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
        }
      }

      // Upload the new profile picture
      const imageDetails = await uploadHandler(profilePicture);
      user.profilePicture = imageDetails.url;
      user.profilePictureId = imageDetails.public_id; // Save the new publicId
    }

    // Save the updated user
    await user.save();

    // Convert user to object and remove sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.OTP;

    return res
      .status(200)
      .json({ msg: "Profile updated successfully", user: userObj });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

// Checking if uploading image to cloudinary is working or not
// export const UploadImage = async (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send("No files were uploaded.");
//     }
//     const file = req.files.image;
//     const imageUrl = await uploadHandler(file);

//     res.status(200).send({
//       message: "File uploaded successfully",
//       url: imageUrl,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
