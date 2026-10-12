const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

function requireJwtSecret(res) {
  if (process.env.JWT_SECRET) return true;

  res.status(500).json({
    error: "Authentication is not configured: JWT_SECRET is missing",
  });
  return false;
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Make sure all required fields were sent
    if (!email || !username || !password) {
      return res.status(400).json({
        error: "Email, username, and password are required",
      });
    }

    if (!requireJwtSecret(res)) return;

    // Check if email already exists
    const existingEmail = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    // Check if username already exists
    const existingUsername = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );

    if (existingUsername.rows.length > 0) {
      return res.status(409).json({
        error: "Username already taken",
      });
    }

    // Hash password before storing it
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, created_at`,
      [email, username, passwordHash],
    );

    const user = result.rows[0];

    // Create token so user is logged in immediately after registering
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user,
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    if (!requireJwtSecret(res)) return;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// =========================
// GET CURRENT USER
// =========================

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, username, created_at
       FROM users
       WHERE id = $1`,
      [req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
