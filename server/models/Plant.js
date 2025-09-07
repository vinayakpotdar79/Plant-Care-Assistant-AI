import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    nickname: { type: String },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plant", plantSchema);
