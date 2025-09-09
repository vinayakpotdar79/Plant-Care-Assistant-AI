import express from "express";
import multer from "multer";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import Plant from "../models/Plant.js";
import dotenv from "dotenv";
import { auth } from "../middleware/auth.js";
dotenv.config();

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload file buffer to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "plants" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// POST /api/plants/add -> Upload + Identify plant
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // 1. Upload image to Cloudinary
    const result = await uploadToCloudinary(file.buffer);

    // 2. Call Plant.id API
    const plantApiRes = await axios.post(
      "https://api.plant.id/v3/identification",
      {
        images: [result.secure_url], // Cloudinary image link
        similar_images: true,
      },
      {
        headers: {
          "Api-Key": process.env.PLANT_ID_KEY,
        },
      }
    );

    const suggestion =
      plantApiRes.data.result.classification.suggestions?.[0] || {};

    res.json({
      plantName: suggestion.name || "Unknown",
      probability: suggestion.probability || 0,
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Save final plant to DB
router.post("/save", async (req, res) => {
  try {
    const { userId, plantName, nickname, imageUrl } = req.body;

    const plant = new Plant({
      userId,
      name: plantName,
      nickname: nickname || plantName,
      imageUrl,
    });

    await plant.save();
    res.json({ message: "Plant saved successfully", plant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save plant" });
  }
});

// Get all plants for logged-in user
router.get("/",auth,async (req, res) => {
  try {
    console.log(req.user)
    // assuming you have user info from auth middleware
    const userId = req.user.id;
    console.log(userId)
    const plants = await Plant.find({ userId });
    res.json(plants);
  } catch (err) {
    console.error("Error fetching plants:", err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

export default router;
