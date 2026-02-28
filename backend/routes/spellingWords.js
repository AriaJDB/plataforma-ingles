const express = require("express");
const multer = require("multer");
const db = require("../db");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Configuración de almacenamiento con nombre temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images/spelling/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nombre temporal basado en milisegundos
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/", (req, res) => {
  db.all("SELECT * FROM spelling_words", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post("/", upload.single("image"), (req, res) => {
  if (!req.body.english) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "English word is required" });
  }

  const english = req.body.english.toUpperCase();
  const spanish = req.body.spanish ? req.body.spanish.toUpperCase() : "";
  const is_active = 1;

  db.run(
    "INSERT INTO spelling_words (english, spanish, is_active) VALUES (?, ?, ?)",
    [english, spanish, is_active],
    function (err) {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      // Renombrar si se subió una imagen
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/spelling/", `${english}${ext}`);
        
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }

      res.json({ id: this.lastID });
    }
  );
});

router.put("/:id", upload.single("image"), (req, res) => {
  const english = req.body.english.toUpperCase();
  const spanish = req.body.spanish.toUpperCase();
  const is_active = req.body.is_active;

  db.run(
    "UPDATE spelling_words SET english=?, spanish=?, is_active=? WHERE id=?",
    [english, spanish, is_active, req.params.id],
    err => {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      // Si se sube una nueva imagen en la edición
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/spelling/", `${english}${ext}`);
        
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }

      res.json({ message: "UPDATED" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM spelling_words WHERE id=?", req.params.id, err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "DELETED" });
  });
});

module.exports = router;