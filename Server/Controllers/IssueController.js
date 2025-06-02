import Issue from "../Models/IssueSchema.js";
import uploadHandler from "../Config/uploadHandler.js";
import { deleteImage } from "../utils/cloundinary.js";

export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("createdBy", "name email profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const createIssue = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Title and description are required." });
    }

    const userId = req.user.id; // Assuming you have the user ID from the auth middleware

    // Handle file upload for issue picture
    const issuePicture = await uploadHandler(req.files.issuePicture);

    // Create a new issue
    const newIssue = new Issue({
      title,
      description,
      createdBy: userId,
      issuePicture: issuePicture.secure_url,
      issuePictureId: issuePicture.public_id,
    });

    await newIssue.save();
    return res.status(201).json(newIssue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getOneIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id).populate("createdBy", "name email");
    if (!issue) {
      return res.status(404).json({ msg: "Issue not found." });
    }
    return res.status(200).json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ msg: error.message });
  }
};
