import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import plantRoutes from "./routes/plants.js"; 
import cors from "cors";
import { auth } from "./middleware/auth.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plants",plantRoutes); 

export default app;
