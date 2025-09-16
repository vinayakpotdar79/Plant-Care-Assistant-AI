import express from "express"
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get current user
router.get("/me",auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user)
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update user
router.put("/me", auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;