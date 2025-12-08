import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import genAI from "../config/gemini.js";
dotenv.config();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/report
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { description } = req.body;
    const file = req.file;

    if (!file && !description) {
      return res.status(400).json({ error: "Please provide an image or description" });
    }

    // Convert image to base64
    let imagePart = null;
    if (file) {
      imagePart = {
        inlineData: {
          data: file.buffer.toString("base64"),
          mimeType: file.mimetype,
        },
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = description
      ? `Plant issue reported: ${description}. Diagnose and suggest solution in proper format.`
      : "Diagnose plant issue from the uploaded image and suggest solution in proper format.";

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            ...(imagePart ? [imagePart] : []),
          ],
        },
      ],
    });

    const diagnosis = result.response.text();

    res.json({ diagnosis });
  } catch (err) {
    console.error("Gemini AI diagnosis error:", err);
    res.status(500).json({ error: "Failed to analyze plant issue" });
  }
});

export default router;
