const express = require("express");
const multer = require("multer");
const db = require("../db");

const router = express.Router();

const fs = require("fs");
const path = require("path");

// 1. Configuración de Multer más simple para evitar el error de "undefined"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images/verbs/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nombre temporal basado en tiempo para que NO dependa del body aquí
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  // Verificación de emergencia
  if (!req.body) {
    return res.status(400).json({ error: "No se recibieron datos" });
  }

  const { present, past, past_participle, spanish, type } = req.body;

  // Si después de Multer, present sigue siendo undefined, el problema es el FormData
  if (!present) {
    return res.status(400).json({ error: "El campo 'present' no llegó al servidor" });
  }

  const presentUpper = present.toUpperCase();

  db.run(
    `INSERT INTO verbs (present, past, past_participle, spanish, type, is_active)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      presentUpper,
      past ? past.toUpperCase() : "",
      past_participle ? past_participle.toUpperCase() : "",
      spanish ? spanish.toUpperCase() : "",
      type
    ],
    function (err) {
      if (err) {
        // Si hay error en la DB, borramos el archivo temporal subido
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json(err);
      }

      // 2. Renombrado final: Ahora que la DB aceptó el registro, ponemos el nombre correcto
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const oldPath = req.file.path;
        const newPath = path.join("images/verbs/", `${presentUpper}${ext}`);

        // Si ya existe un archivo con ese nombre (ej. sobreescribir), lo borramos antes
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        
        fs.renameSync(oldPath, newPath);
      }

      res.json({ id: this.lastID });
    }
  );
});


router.get("/", (req, res) => {
  db.all("SELECT * FROM verbs", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});


router.put("/:id", upload.single("image"), (req, res) => {
  const { present, past, past_participle, spanish, type, is_active } = req.body;

  db.run(
    `UPDATE verbs SET present=?, past=?, past_participle=?, spanish=?, type=?, is_active=? WHERE id=?`,
    [
      present.toUpperCase(),
      past.toUpperCase(),
      past_participle.toUpperCase(),
      spanish.toUpperCase(),
      type,
      is_active,
      req.params.id
    ],
    err => {
      if (err) return res.status(500).json(err);
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