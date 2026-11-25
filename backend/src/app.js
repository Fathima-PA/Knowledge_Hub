
import express from "express";
import documentRoutes from "./routes/document.routes.js";
import cors from "cors";
const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
// Middleware
app.use(express.json());

// Health check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KnowledgeHub backend is running"
  });
});

// Document routes
app.use("/api/documents", documentRoutes);

export default app;
