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
    const { title, description, hasStatus } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res
        .status(400)
        .json({ msg: "Title and description are required." });
    }

    const userId = req.user.id;

    // Initialize issue data
    const issueData = {
      title,
      description,
      createdBy: userId,
      reactions: { likes: 0, loves: 0, joys: 0, sads: 0 },
      reactedUsers: [],
      comments: [],
      hasStatus: hasStatus === true || hasStatus === "true",
    };

    // Only add status if hasStatus is true
    if (issueData.hasStatus) {
      issueData.status = "Open"; // Default to "Open" when status is enabled
    }

    // Handle optional file upload for issue picture
    if (req.files && req.files.issuePicture) {
      try {
        const issuePicture = await uploadHandler(req.files.issuePicture);
        issueData.issuePicture = issuePicture.secure_url || issuePicture.url;
        issueData.issuePictureId = issuePicture.public_id;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        // Continue without image if upload fails
        issueData.issuePicture = "";
        issueData.issuePictureId = "";
      }
    } else {
      // No image provided
      issueData.issuePicture = "";
      issueData.issuePictureId = "";
    }

    // Create a new issue
    const newIssue = new Issue(issueData);
    await newIssue.save();

    // Populate the created issue with user data
    const populatedIssue = await Issue.findById(newIssue._id).populate(
      "createdBy",
      "name email profilePicture"
    );

    return res.status(201).json(populatedIssue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getOneIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id)
      .populate("createdBy", "name email profilePicture")
      .populate("comments.user", "name profilePicture");
    if (!issue) {
      return res.status(404).json({ msg: "Issue not found." });
    }
    return res.status(200).json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Add or update a user's reaction to an issue
export const reactToIssue = async (req, res) => {
  try {
    const { id } = req.params; // issue id
    const { reaction } = req.body; // "likes", "loves", "joys", "sads"
    const userId = req.user.id;

    if (!["likes", "loves", "joys", "sads"].includes(reaction)) {
      return res.status(400).json({ msg: "Invalid reaction type." });
    }

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ msg: "Issue not found." });

    // Ensure reactions object exists
    if (!issue.reactions) {
      issue.reactions = { likes: 0, loves: 0, joys: 0, sads: 0 };
    }

    // Check if user already reacted with the same reaction
    const existingReaction = issue.reactedUsers.find(
      (ru) => ru.user.toString() === userId && ru.reaction === reaction
    );

    if (existingReaction) {
      // User clicked the same reaction again, so remove their reaction
      issue.reactedUsers = issue.reactedUsers.filter(
        (ru) => ru.user.toString() !== userId
      );
    } else {
      // Remove any previous reaction by this user
      issue.reactedUsers = issue.reactedUsers.filter(
        (ru) => ru.user.toString() !== userId
      );
      // Add new reaction
      issue.reactedUsers.push({ user: userId, reaction });
    }

    // Reset all counts
    issue.reactions.likes = issue.reactedUsers.filter(
      (r) => r.reaction === "likes"
    ).length;
    issue.reactions.loves = issue.reactedUsers.filter(
      (r) => r.reaction === "loves"
    ).length;
    issue.reactions.joys = issue.reactedUsers.filter(
      (r) => r.reaction === "joys"
    ).length;
    issue.reactions.sads = issue.reactedUsers.filter(
      (r) => r.reaction === "sads"
    ).length;

    await issue.save();
    const populatedIssue = await Issue.findById(issue._id).populate(
      "createdBy",
      "name email profilePicture"
    );
    return res.status(200).json(populatedIssue);
  } catch (error) {
    console.error("Error reacting to issue:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // issue id
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) return res.status(400).json({ msg: "Comment text required." });

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ msg: "Issue not found." });

    issue.comments.push({ user: userId, text });
    await issue.save();

    // Populate user in comments before returning
    const updatedIssue = await Issue.findById(id)
      .populate("createdBy", "name email profilePicture")
      .populate("comments.user", "name profilePicture");

    return res.status(200).json(updatedIssue.comments);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, hasStatus, removeIssuePicture } =
      req.body;
    const userId = req.user.id;

    // Find the issue and check ownership
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ msg: "Issue not found." });

    // Only the creator can edit
    if (issue.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Not authorized to edit this issue." });
    }

    // Update fields
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;

    // Handle status updates
    if (hasStatus !== undefined) {
      const hasStatusBool = hasStatus === true || hasStatus === "true";
      issue.hasStatus = hasStatusBool;

      if (hasStatusBool) {
        // If enabling status and no status provided, default to "Open"
        issue.status = status || issue.status || "Open";
      } else {
        // If disabling status, remove the status field
        issue.status = undefined;
      }
    } else if (status !== undefined && issue.hasStatus) {
      // Only update status if hasStatus is true
      issue.status = status;
    }

    // Handle issue picture removal
    if (removeIssuePicture === "true") {
      if (issue.issuePictureId) {
        try {
          await deleteImage(issue.issuePictureId);
        } catch (error) {
          console.error("Error deleting old issue picture:", error);
        }
      }
      issue.issuePicture = "";
      issue.issuePictureId = "";
    }

    // Handle issue picture upload
    if (req.files && req.files.issuePicture) {
      const file = req.files.issuePicture;
      // Delete old image if exists
      if (issue.issuePictureId) {
        try {
          await deleteImage(issue.issuePictureId);
        } catch (error) {
          console.error("Error deleting old issue picture:", error);
        }
      }
      // Upload new image
      const imageDetails = await uploadHandler(file);
      issue.issuePicture = imageDetails.secure_url || imageDetails.url;
      issue.issuePictureId = imageDetails.public_id;
    }

    await issue.save();

    // Populate createdBy for response
    const updatedIssue = await Issue.findById(id).populate(
      "createdBy",
      "name email profilePicture"
    );

    return res
      .status(200)
      .json({ msg: "Issue updated successfully", issue: updatedIssue });
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ msg: "Issue not found." });
    // Only the creator can delete
    if (issue.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this issue." });
    }

    // Delete issue picture if it exists
    if (issue.issuePictureId) {
      try {
        await deleteImage(issue.issuePictureId);
      } catch (error) {
        console.error("Error deleting issue picture:", error);
      }
    }

    await Issue.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Issue deleted successfully." });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getUserIssues = async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await Issue.find({ createdBy: userId })
      .populate("createdBy", "name email profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ msg: error.message });
  }
};
