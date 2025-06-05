import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import accountRoutes from "./Routes/AccountRoute.js";
import profileRoutes from "./Routes/ProfileRoute.js";
import issueRoutes from "./Routes/IssueRoute.js";
import officerRoutes from "./Routes/OfficerRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://10.132.215.220:8081", // Metro bundler (web)
      "http://10.132.215.220:19006", // Expo web (if used)
      "exp://10.132.215.220:8081", // Expo Go app
      "http://localhost:5173", // React app
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(fileUpload());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/account", accountRoutes);
app.use("/profile", profileRoutes);
app.use("/issue", issueRoutes);
app.use("/officer", officerRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
