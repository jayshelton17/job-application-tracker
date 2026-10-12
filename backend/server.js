require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const db = require("./db");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const applicationsRoutes = require("./routes/applications");

const app = express();

const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/applications", applicationsRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.json({
    message: "Job Application Tracker API is running",
  });
});

// Test Neon PostgreSQL connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT NOW() AS current_time, current_database() AS database",
    );

    res.json({
      message: "Successfully connected to Neon!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      error: "Failed to connect to Neon database",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
