const express = require("express");
const multer = require("multer");
const db = require("../db");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images/verbs/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/", (req, res) => {
  db.all("SELECT * FROM verbs", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post("/", upload.single("image"), (req, res) => {
  const { spanish, present, past_simple, past_participle, gerund, third_person, phonetic, type } = req.body;

  if (!present) return res.status(400).json({ error: "Present es requerido" });

  const presentUpper = present.toUpperCase();

  db.run(
    `INSERT INTO verbs (spanish, present, past_simple, past_participle, gerund, third_person, phonetic, type, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      (spanish || "").toUpperCase(),
      presentUpper,
      (past_simple || "").toUpperCase(),
      (past_participle || "").toUpperCase(),
      (gerund || "").toUpperCase(),
      (third_person || "").toUpperCase(),
      (phonetic || "").toUpperCase(),
      (type || "REGULAR").toUpperCase()
    ],
    function (err) {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: err.message });
      }

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/verbs/", `${presentUpper}${ext}`);
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }
      res.json({ id: this.lastID });
    }
  );
});

router.put("/:id", upload.single("image"), (req, res) => {
  const { spanish, present, past_simple, past_participle, gerund, third_person, phonetic, type, is_active } = req.body;

  if (!present) return res.status(400).json({ error: "Present es requerido" });

  const presentUpper = present.toUpperCase();

  db.run(
    `UPDATE verbs 
     SET spanish=?, present=?, past_simple=?, past_participle=?, gerund=?, third_person=?, phonetic=?, type=?, is_active=? 
     WHERE id=?`,
    [
      (spanish || "").toUpperCase(),
      presentUpper,
      (past_simple || "").toUpperCase(),
      (past_participle || "").toUpperCase(),
      (gerund || "").toUpperCase(),
      (third_person || "").toUpperCase(),
      (phonetic || "").toUpperCase(),
      (type || "REGULAR").toUpperCase(),
      is_active,
      req.params.id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newPath = path.join("images/verbs/", `${presentUpper}${ext}`);
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(req.file.path, newPath);
      }
      res.json({ message: "UPDATED" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM verbs WHERE id=?", req.params.id, err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "DELETED" });
  });
});

module.exports = router;