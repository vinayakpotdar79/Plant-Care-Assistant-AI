import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import plantRoutes from "./routes/plants.js"; 
import reportIssueRoutes from "./routes/reportRoutes.js"
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plants",plantRoutes); 
app.use("/api/report",reportIssueRoutes)
export default app;
