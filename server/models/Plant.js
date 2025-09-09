import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  nickname: { type: String },
  imageUrl: { type: String, required: true }, // cloudinary URL
  water: { type: String },
  sunlight: { type: String },
  nextCare: { type: String },
  health: { type: Number, default: 100 },
  lastWatered: { type: String, default: "Not yet" },
  needsAttention: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Plant", plantSchema);
