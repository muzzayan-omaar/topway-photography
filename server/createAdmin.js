import "dotenv/config";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Admin from "./models/Admin.js";

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash(
  "admin123",
  10
);

await Admin.create({
  username: "admin",
  password: hashedPassword,
});

console.log("Admin Created");

process.exit();