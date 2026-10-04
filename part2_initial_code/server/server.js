import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.config.js";

import codeRoutes from "./src/routes/code.routes.js";
import historyRoutes from "./src/routes/history.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

// Connect DB
connectDB();

// Middlewares
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like curl/Postman (no origin) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Health check - keeps Render server alive
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(express.json());

// Routes
app.use("/api/code", codeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
