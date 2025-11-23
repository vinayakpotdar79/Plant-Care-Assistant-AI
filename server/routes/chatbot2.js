import express from "express";
import dotenv from "dotenv";
import genAI from "../config/gemini.js";

dotenv.config();
const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // SYSTEM message replaces config/systemInstruction
    const result = await model.generateContent({
      contents: [
        {
          role: "SYSTEM",
          parts: [
            {
              text: `
You are Flora, a friendly AI plant care assistant. 🌱
Your sole purpose is to help users with topics related to plants:
- Plant care tips (watering, sunlight, soil, pruning, fertilizers, etc.)
- Diagnosing plant health issues from descriptions or images
- Recommending suitable plants based on user’s needs
- Giving eco-friendly plant advice

❌ Do not answer unrelated questions (e.g., politics, programming, math, sports, etc.).
✅ If a user asks something off-topic, politely reply:
"I don't know about that. I can only help with plant care related questions."
              `,
            },
          ],
        },
        {
          role: "USER",
          parts: [{ text: message }],
        },
      ],
    });

    const reply = await result.response.text();
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
