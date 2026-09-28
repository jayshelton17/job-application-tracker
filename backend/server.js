require("dotenv").config();

const express = require("express");

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
