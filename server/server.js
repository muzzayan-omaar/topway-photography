import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import authRoutes from "./routes/authRoutes.js";



const app = express();

// 1. Middleware FIRST
app.use(cors());
app.use(express.json());

// 2. DB connection
connectDB();

// 3. Routes AFTER middleware
app.use("/api/gallery", galleryRoutes);
app.use("/api/auth", authRoutes);

// 4. Basic route
app.get("/", (req, res) => {
  res.send("Topway Visuals API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);