const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { firstName, lastName } = req.body;

  db.run(
    "INSERT INTO students (firstName, lastName) VALUES (?, ?)",
    [firstName, lastName],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;