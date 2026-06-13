import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

console.log("GALLERY CONTROLLER LOADED");
export const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({
      createdAt: -1,
    });

    res.json(gallery);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createGallery = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, category, featured } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file received",
      });
    }

    const uploaded = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "rodney-visuals/gallery",
      }
    );

    console.log("CLOUDINARY:", uploaded.secure_url);

    const gallery = await Gallery.create({
      title,
      category,
      featured,
      image: uploaded.secure_url,
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error("CREATE GALLERY ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }

    gallery.title =
      req.body.title || gallery.title;

    gallery.category =
      req.body.category || gallery.category;

    if (req.body.featured !== undefined) {
      gallery.featured = req.body.featured;
    }

    await gallery.save();

    res.json(gallery);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};