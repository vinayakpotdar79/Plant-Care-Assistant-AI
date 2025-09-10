import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  nickname: { type: String },
  imageUrl: { type: String, required: true }, // cloudinary URL
  health: { type: Number, default: 100 },
  lastWatered: { type: String, default: "Not yet" },
  nextWatering: { type: Date, default: null },
  needsAttention: { type: Boolean, default: false },
  wateringFrequency: { type: Number, default: 3 }, // in days
}, { timestamps: true });

export default mongoose.model("Plant", plantSchema);
