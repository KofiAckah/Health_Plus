import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import accountRoutes from "./Routes/AccountRoute.js";
import profileRoutes from "./Routes/ProfileRoute.js";
import issueRoutes from "./Routes/IssueRoute.js";
import officerRoutes from "./Routes/OfficerRoute.js";
import emergencyCallRoutes from "./Routes/EmergencyCallRoute.js";
import helpRoutes from "./Routes/HelpRoute.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Officers_Teams
      "http://10.132.215.220:8081",
      "http://10.132.215.220:19006",
      "exp://10.132.215.220:8081",
    ],
    credentials: true,
  },
});

app.set("io", io); // Make io accessible in routes/controllers

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      // "http://10.132.215.220:8081",
      // "exp://10.132.215.220:8081",
      "http://localhost:5001", // Officers_Teams
      "http://localhost:5002", // Client Website
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

// Add API key endpoint
app.get("/config/google-maps-key", (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});
app.get("/config/gemini-key", (req, res) => {
  res.json({ apiKey: process.env.GEMINI_API_KEY });
});

app.use("/account", accountRoutes);
app.use("/profile", profileRoutes);
app.use("/issue", issueRoutes);
app.use("/officer", officerRoutes);
app.use("/emergency-call", emergencyCallRoutes);
app.use("/help", helpRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

io.on("connection", (socket) => {
  console.log("Officer dashboard connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Officer dashboard disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
