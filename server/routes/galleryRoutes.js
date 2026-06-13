import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

import {
  getGallery,
  createGallery,
  deleteGallery,
  updateGallery
} from "../controllers/galleryController.js";

const router = express.Router();

router.get("/", getGallery);




router.post(
  "/",
  protect,
  upload.single("image"),
  createGallery
);

router.delete(
  "/:id",
  protect,
  deleteGallery
);

router.put(
  "/:id",
  protect,
  updateGallery
);
export default router;