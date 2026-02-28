const express = require("express");
const multer = require("multer");
const db = require("../db");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Configuración de Multer segura
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images/words/";
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
  db.all("SELECT * FROM book_words", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// POST
router.post("/", upload.single("image"), (req, res) => {
  const { english, spanish, month, week, category, topic, page, is_active } = req.body;

  if (!english) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "El campo 'english' es obligatorio" });
  }

  const englishUpper = english.toUpperCase();

  db.run(
    `INSERT INTO book_words 
    (english, spanish, month, week, category, topic, page, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      englishUpper,
      spanish ? spanish.toUpperCase() : "",
      month,
      week,
      category,
      topic,
      page,
      is_active || 1
    ],
    function (err) {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      // Renombrar imagen con el nombre en inglés
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const oldPath = req.file.path;
        const newPath = path.join("images/words/", `${englishUpper}${ext}`);

        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(oldPath, newPath);
      }

      res.json({ id: this.lastID });
    }
  );
});

// PUT
router.put("/:id", upload.single("image"), (req, res) => {
  const { english, spanish, month, week, category, topic, page, is_active } = req.body;
  const englishUpper = english.toUpperCase();

  db.run(
    `UPDATE book_words 
     SET english=?, spanish=?, month=?, week=?, category=?, topic=?, page=?, is_active=?
     WHERE id=?`,
    [englishUpper, spanish.toUpperCase(), month, week, category, topic, page, is_active, req.params.id],
    err => {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/words/", `${englishUpper}${ext}`);
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }

      res.json({ message: "UPDATED" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM book_words WHERE id=?", req.params.id, err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "DELETED" });
  });
});

router.put("/bulk-update", (req, res) => {
  const { status, filters } = req.body;
  let query = "UPDATE book_words SET is_active = ? WHERE 1=1";
  let params = [status];

  if (filters) {
    if (filters.category !== 'ALL') {
      query += " AND category = ?";
      params.push(filters.category);
    }
    if (filters.topic !== 'ALL') {
      query += " AND topic = ?";
      params.push(filters.topic);
    }
    // Filtros de rango (Month, Week, Page)
    if (filters.useRange) {
      query += " AND month >= ? AND month <= ?";
      query += " AND week >= ? AND week <= ?";
      query += " AND page >= ? AND page <= ?";
      params.push(filters.startMonth, filters.finishMonth, filters.startWeek, filters.finishWeek, filters.startPage, filters.finishPage);
    }
  }

  db.run(query, params, function(err) {
    if (err) return res.status(500).json(err);
    res.json({ updated: this.changes });
  });
});

module.exports = router;