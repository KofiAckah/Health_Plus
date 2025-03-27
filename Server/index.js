import express from "express";
import mongoose from "mongoose";

const app = express();
const Port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
