const express = require("express");
const router = express.Router();
const db = require("../db");

router.put("/bulk-update", async (req, res) => {
  const { status, tables, bookFilters, idFilters, verbType } = req.body;

  try {
    // 1. Procesar BOOK WORDS
    if (tables.book) {
      let query = "UPDATE book_words SET is_active = ?";
      let params = [status];

      if (bookFilters.useRange) {
        query += ` WHERE month BETWEEN ? AND ? 
                   AND week BETWEEN ? AND ? 
                   AND page BETWEEN ? AND ?`;
        params.push(bookFilters.startMonth, bookFilters.finishMonth, 
                    bookFilters.startWeek, bookFilters.finishWeek, 
                    bookFilters.startPage, bookFilters.finishPage);
      }

      if (bookFilters.category !== "ALL") {
        query += bookFilters.useRange ? " AND category = ?" : " WHERE category = ?";
        params.push(bookFilters.category);
      }

      db.run(query, params);
    }

    // 2. Procesar VERBS (Filtro por Tipo)
    if (tables.verbs) {
      let query = "UPDATE verbs SET is_active = ?";
      let params = [status];
      if (verbType !== "ALL") {
        query += " WHERE type = ?";
        params.push(verbType);
      }
      db.run(query, params);
    }

    // 3. Procesar Tablas con Rango de ID (Spelling, Nouns, Adjectives)
    const idTables = ["spelling", "nouns", "adjectives"];
    idTables.forEach(table => {
      if (tables[table]) {
        const tableName = table === "spelling" ? "spelling_words" : table;
        const range = idFilters[table];
        db.run(
          `UPDATE ${tableName} SET is_active = ? WHERE id BETWEEN ? AND ?`,
          [status, range.start, range.end]
        );
      }
    });

    res.json({ message: "Actualización masiva completada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;