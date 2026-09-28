const express = require("express");

const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// All application routes require authentication
router.use(authMiddleware);

// CREATE APPLICATION
router.post("/", async (req, res) => {
  try {
    const { company, position, status, date_applied } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        error: "Company and position are required",
      });
    }

    const result = await db.query(
      `INSERT INTO applications
				(user_id, company, position, status, date_applied)
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING *`,
      [
        req.userId,
        company,
        position,
        status || "Applied",
        date_applied || null,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// GET ALL MY APPLICATIONS
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT *
			 FROM applications
			 WHERE user_id = $1
			 ORDER BY id DESC`,
      [req.userId],
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// GET ONE APPLICATION
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT *
			 FROM applications
			 WHERE id = $1
			   AND user_id = $2`,
      [id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Application not found",
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

// UPDATE APPLICATION
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { company, position, status, date_applied } = req.body;

    const currentApplication = await db.query(
      `SELECT *
			 FROM applications
			 WHERE id = $1
			   AND user_id = $2`,
      [id, req.userId],
    );

    if (currentApplication.rows.length === 0) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    const current = currentApplication.rows[0];

    const updatedCompany = company ?? current.company;

    const updatedPosition = position ?? current.position;

    const updatedStatus = status ?? current.status;

    const updatedDate = date_applied ?? current.date_applied;

    const result = await db.query(
      `UPDATE applications
			 SET company = $1,
			     position = $2,
			     status = $3,
			     date_applied = $4
			 WHERE id = $5
			   AND user_id = $6
			 RETURNING *`,
      [
        updatedCompany,
        updatedPosition,
        updatedStatus,
        updatedDate,
        id,
        req.userId,
      ],
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// DELETE APPLICATION
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM applications
			 WHERE id = $1
			   AND user_id = $2
			 RETURNING id`,
      [id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
