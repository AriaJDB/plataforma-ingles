const express = require("express");
const db = require("../db");

const router = express.Router();

// GET: Obtener todos los alumnos
router.get("/", (req, res) => {
  db.all("SELECT * FROM students ORDER BY lastName ASC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// POST: Crear nuevo alumno
router.post("/", (req, res) => {
  const { firstName, lastName, is_active } = req.body;
  const firstNameUpper = (firstName || "").toUpperCase();
  const lastNameUpper = (lastName || "").toUpperCase();

  db.run(
    "INSERT INTO students (firstName, lastName, is_active) VALUES (?, ?, ?)",
    [firstNameUpper, lastNameUpper, is_active || 1],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// PUT: Editar alumno existente
router.put("/:id", (req, res) => {
  const { firstName, lastName, is_active } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE students SET firstName = ?, lastName = ?, is_active = ? WHERE id = ?",
    [(firstName || "").toUpperCase(), (lastName || "").toUpperCase(), is_active || 1, id],
    function (err) {
      if (err) return res.status(500).json(err);
      
      if (this.changes === 0) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }

      res.json({ message: "Alumno actualizado con éxito" });
    }
  );
});

// DELETE: Eliminar alumno
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM students WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ message: "DELETED" });
  });
});

module.exports = router;