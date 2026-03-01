const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM students ORDER BY lastName ASC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

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

router.put("/:id", (req, res) => {
  const { firstName, lastName, is_active } = req.body;
  const { id } = req.params;
  const statusToSave = (is_active !== undefined) ? is_active : 1;

  db.run(
    "UPDATE students SET firstName = ?, lastName = ?, is_active = ? WHERE id = ?",
    [
      (firstName || "").toUpperCase(), 
      (lastName || "").toUpperCase(), 
      statusToSave, 
      id
    ],
    function (err) {
      if (err) return res.status(500).json(err);
      
      if (this.changes === 0) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }

      res.json({ message: "Alumno actualizado con éxito" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM students WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ message: "DELETED" });
  });
});

module.exports = router;