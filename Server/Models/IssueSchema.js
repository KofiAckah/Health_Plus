import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const reactionSchema = new mongoose.Schema({
  likes: {
    type: Number,
    default: 0,
  },
  loves: {
    type: Number,
    default: 0,
  },
  joys: {
    type: Number,
    default: 0,
  },
  sads: {
    type: Number,
    default: 0,
  },
});

const reactedUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reaction: {
    type: String,
    enum: ["likes", "loves", "joys", "sads"],
    required: true,
  },
});

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    reactions: reactionSchema,
    reactedUsers: [reactedUserSchema],
    issuePicture: {
      type: String,
      required: false,
      default: "",
    },
    issuePictureId: {
      type: String,
      required: false,
      default: "",
    },
    hasStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      required: false, // Make status optional
      default: undefined, // No default value
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
