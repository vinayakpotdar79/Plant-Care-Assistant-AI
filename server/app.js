import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors"
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors())
// Routes
app.use("/api/auth", authRoutes);

export default app;
