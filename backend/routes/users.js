const express = require("express");

const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");


// UPDATE ACCOUNT
router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email && !username) {
      return res.status(400).json({
        error: "Email or username is required",
      });
    }

    const currentUser = await db.query(
      `SELECT email, username
			 FROM users
			 WHERE id = $1`,
      [req.userId],
    );

    if (currentUser.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const newEmail = email || currentUser.rows[0].email;

    const newUsername = username || currentUser.rows[0].username;

    const result = await db.query(
      `UPDATE users
			 SET email = $1,
			    username = $2
			 WHERE id = $3
			 RETURNING id, email, username, created_at`,
      [newEmail, newUsername, req.userId],
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {

    // PostgreSQL unique constraint violation
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Email or username already in use",
      });
    }

    console.error(err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// DELETE ACCOUNT
router.delete("/me", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM users
			 WHERE id = $1
			 RETURNING id`,
      [req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
