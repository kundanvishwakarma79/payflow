const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const mainRouter = require("./routes/mainRouter");
const logger = require("./config/logger");

const notFound = require("./middleware/notFound");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// =======================
// Security
// =======================
app.use(helmet());

// =======================
// Compression
// =======================
app.use(compression());

// =======================
// Logger
// =======================
app.use(logger);

// =======================
// CORS
// =======================
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// =======================
// Body Parser
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Cookie Parser
// =======================
app.use(cookieParser());

// =======================
// Routes
// =======================
app.use("/api/v1", mainRouter);

// =======================
// Health Check
// =======================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// =======================
// Error Handlers
// =======================
app.use(notFound);
app.use(errorMiddleware);

module.exports = app;