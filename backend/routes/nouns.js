const express = require("express");
const multer = require("multer");
const db = require("../db");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images/nouns/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nombre temporal
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET
router.get("/", (req, res) => {
  const { is_active } = req.query;
  let query = "SELECT * FROM nouns WHERE 1=1";
  let params = [];

  if (is_active !== undefined) {
    query += " AND is_active = ?";
    params.push(is_active === "true" ? 1 : 0);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// POST
router.post("/", upload.single("image"), (req, res) => {
  const { spanish, english, is_active } = req.body;

  if (!english) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "English word is required" });
  }

  const englishUpper = english.toUpperCase();

  db.run(
    "INSERT INTO nouns (spanish, english, is_active) VALUES (?, ?, ?)",
    [spanish ? spanish.toUpperCase() : "", englishUpper, is_active || 1],
    function (err) {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      // Renombrar imagen
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/nouns/", `${englishUpper}${ext}`);
        
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }

      res.json({ id: this.lastID });
    }
  );
});

// PUT
router.put("/:id", upload.single("image"), (req, res) => {
  const { spanish, english, is_active } = req.body;
  const englishUpper = english.toUpperCase();

  db.run(
    "UPDATE nouns SET spanish=?, english=?, is_active=? WHERE id=?",
    [spanish.toUpperCase(), englishUpper, is_active, req.params.id],
    err => {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/nouns/", `${englishUpper}${ext}`);
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }

      res.json({ message: "UPDATED" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM nouns WHERE id=?", req.params.id, err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "DELETED" });
  });
});

module.exports = router;