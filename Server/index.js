import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import accountRoutes from "./Routes/AccountRoute.js";

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/account", accountRoutes);

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
