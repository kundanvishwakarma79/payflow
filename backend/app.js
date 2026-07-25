const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const logger = require("./config/logger");

const app = express();

// Security
app.use(helmet());

// Compression
app.use(compression());

// Logger
app.use(logger);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// CORS
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});



const errorMiddleware = require("./middleware/errorMiddleware");

app.use(errorMiddleware);

module.exports = app;