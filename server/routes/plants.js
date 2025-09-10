import express from "express";
import multer from "multer";
import axios from "axios";
import Plant from "../models/Plant.js";
import dotenv from "dotenv";
import { auth } from "../middleware/auth.js";
import cloudinary from "../config/cloud.js"
dotenv.config();

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    console.log(req.body)
    const { userId,plantName, nickname, imageUrl } = req.body;

    const plant = new Plant({
      userId,
      name: plantName,
      nickname: nickname || plantName,
      imageUrl,
      water: "Every 3 days",     // optional defaults
      sunlight:"Indirect Sunlight",
      nextCare: "Not scheduled",
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
    // assuming you have user info from auth middleware
    const userId = req.user.id;
    const plants = await Plant.find({ userId });

     const today = new Date();
    const updatedPlants = plants.map((plant) => {
      if (plant.lastWatered !== "Not yet") {
        const lastDate = new Date(plant.lastWatered);
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        // Needs attention if overdue
        if (diffDays >= plant.wateringFrequency) {
          plant.needsAttention = true;
          // decrease health (max penalty 10 per overdue day)
          plant.health = Math.max(
            0,
            plant.health - (diffDays - plant.wateringFrequency + 1) * 10
          );
        } else {
          plant.needsAttention = false;
        }

         // Update next watering
        plant.nextWatering = new Date(lastDate);
        plant.nextWatering.setDate(lastDate.getDate() + plant.wateringFrequency);
        plant.save()
      }
      return plant;
    });

    // DB to always stay updated)
    // await Promise.all(updatedPlants.map((p) => p.save()));
    res.status(200).json(updatedPlants);
  } catch (err) {
    console.error("Error fetching plants:", err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});
//  Get a plant by ID 
router.get("/:id", auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(plant);
  } catch (err) {
    console.error("Error fetching plant:", err);
    res.status(500).json({ error: "Failed to fetch plant" });
  }
});


router.patch("/:id/water", auth,async (req, res) => {
  try {
  const plant = await Plant.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });  
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    const now = new Date();
    plant.lastWatered = now;
    plant.needsAttention = false;
    plant.health = Math.min(100, plant.health + 20);

    // Update next watering date
    plant.nextWatering = new Date(now);
    plant.nextWatering.setDate(now.getDate() + plant.wateringFrequency);

    await plant.save();

    res.json({
      message: "Plant marked as watered",
      plant,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating plant" });
  }
});

// Delete Plant
router.delete("/:id", auth, async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
