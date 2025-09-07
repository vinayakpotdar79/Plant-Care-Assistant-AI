import express from "express";
import multer from "multer";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import Plant from "../models/Plant.js";

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// POST /api/plants/add
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to cloudinary
    const uploadRes = await cloudinary.uploader.upload_stream(
      { folder: "plants" },
      async (err, result) => {
        if (err) return res.status(500).json({ error: "Cloud upload failed" });

        // Send to Plant.id API
        const plantApiRes = await axios.post(
          "https://api.plant.id/v3/identification",
          {
            images: [result.secure_url],
            similar_images: true,
          },
          {
            headers: {
              "Api-Key": process.env.PLANT_ID_KEY,
            },
          }
        );

        const suggestion = plantApiRes.data.result.classification.suggestions[0];

        res.json({
          plantName: suggestion.name,
          probability: suggestion.probability,
          imageUrl: result.secure_url,
        });
      }
    );

    uploadRes.end(file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Save final plant
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
    res.status(500).json({ error: "Failed to save plant" });
  }
});

export default router;
