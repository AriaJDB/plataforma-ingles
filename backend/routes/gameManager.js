const express = require("express");
const router = express.Router();
const db = require("../db");

router.put("/bulk-update", (req, res) => {
  const { status, tables, bookFilters } = req.body; // status: 1 o 0

  db.serialize(() => {
    // 1. Procesar tablas simples (Spelling, Verbs, Nouns, Adjectives)
    const simpleTables = ["spelling_words", "verbs", "nouns", "adjectives"];
    
    simpleTables.forEach(table => {
      // Solo actualiza si la tabla fue seleccionada en el checkbox
      if (tables[table.split('_')[0]] || tables[table]) {
        db.run(`UPDATE ${table} SET is_active = ?`, [status]);
      }
    });

    // 2. Procesar Book Words con sus filtros específicos
    if (tables.book) {
      let query = "UPDATE book_words SET is_active = ? WHERE 1=1";
      let params = [status];

      if (bookFilters.useRange) {
        query += " AND month >= ? AND month <= ? AND week >= ? AND week <= ? AND page >= ? AND page <= ?";
        params.push(
          bookFilters.startMonth, bookFilters.finishMonth,
          bookFilters.startWeek, bookFilters.finishWeek,
          bookFilters.startPage, bookFilters.finishPage
        );
      }

      if (bookFilters.category !== "ALL") {
        query += " AND category = ?";
        params.push(bookFilters.category);
      }

      if (bookFilters.topic !== "ALL") {
        query += " AND topic = ?";
        params.push(bookFilters.topic);
      }

      db.run(query, params);
    }
  });

  res.json({ message: "Proceso de actualización masiva completado" });
});

// backend/routes/gameManager.js
router.get("/active-words", (req, res) => {
  const query = `
    SELECT id, english, 'words' as folder FROM book_words WHERE is_active = 1
    UNION
    SELECT id, english, 'spelling' as folder FROM spelling_words WHERE is_active = 1
    UNION
    SELECT id, present as english, 'verbs' as folder FROM verbs WHERE is_active = 1
    UNION
    SELECT id, english, 'nouns' as folder FROM nouns WHERE is_active = 1
    UNION
    SELECT id, english, 'adjectives' as folder FROM adjectives WHERE is_active = 1
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

module.exports = router;