import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

// Allow our React frontend to talk to this backend
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,           // ← ADD THIS
}));

app.options('*', cors());      // ← ADD THIS (fixes preflight 502)

// Health check — keeps Render from sleeping
app.get('/health', (req, res) => res.json({ status: 'ok' })); // ← ADD THIS

// Convert incoming JSON requests to JavaScript objects
app.use(express.json());

// Mount all API routes under /api
app.use("/api", routes);

// Handle errors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;