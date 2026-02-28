const express = require("express");
const multer = require("multer");
const db = require("../db");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Configuración de Multer segura
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images/adjectives/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nombre temporal basado en timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET
router.get("/", (req, res) => {
  const { is_active } = req.query;
  let query = "SELECT * FROM adjectives WHERE 1=1";
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
// POST - Corregido con protecciones contra valores undefined
router.post("/", upload.single("image"), (req, res) => {
  const { spanish, english, comparative, superlative, phonetic, is_active } = req.body;

  if (!english) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "English word is required" });
  }

  // Usamos || "" para evitar errores si el campo viene vacío desde el frontend
  const englishUpper = english.toUpperCase();
  const comparativeUpper = (comparative || "").toUpperCase();
  const superlativeUpper = (superlative || "").toUpperCase();
  const phoneticUpper = (phonetic || "").toUpperCase();
  const spanishUpper = (spanish || "").toUpperCase();

  db.run(
    "INSERT INTO adjectives (spanish, english, comparative, superlative, phonetic, is_active) VALUES (?, ?, ?, ?, ?, ?)",
    [spanishUpper, englishUpper, comparativeUpper, superlativeUpper, phoneticUpper, is_active || 1],
    function (err) {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const oldPath = req.file.path;
        const newPath = path.join("images/adjectives/", `${englishUpper}${ext}`);
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(oldPath, newPath);
      }
      res.json({ id: this.lastID });
    }
  );
});

// PUT - Corregido con la sentencia SQL completa
router.put("/:id", upload.single("image"), (req, res) => {
  const { spanish, english, comparative, superlative, phonetic, is_active } = req.body;
  
  const englishUpper = (english || "").toUpperCase();
  const comparativeUpper = (comparative || "").toUpperCase();
  const superlativeUpper = (superlative || "").toUpperCase();
  const phoneticUpper = (phonetic || "").toUpperCase();
  const spanishUpper = (spanish || "").toUpperCase();

  db.run(
    `UPDATE adjectives 
     SET spanish=?, english=?, comparative=?, superlative=?, phonetic=?, is_active=? 
     WHERE id=?`,
    [
      spanishUpper, 
      englishUpper, 
      comparativeUpper, 
      superlativeUpper, 
      phoneticUpper, 
      is_active, 
      req.params.id
    ],
    err => {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      if (req.file && englishUpper) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/adjectives/", `${englishUpper}${ext}`);
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }

      res.json({ message: "UPDATED" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM adjectives WHERE id=?", req.params.id, err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "DELETED" });
  });
});

module.exports = router;