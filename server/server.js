require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const ticketRoutes = require("./ticketRoutes");
const authRoutes = require("./authRoutes");
const helmet = require("helmet");
const app = express();
app.use(cors());
app.use(helmet());
const PORT = 5000;


// Middleware
app.use(express.json());
app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("SupportDesk Backend is running!");
});

// Database test route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0]
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});







// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});