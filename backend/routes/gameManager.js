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

// GET: Obtener todas las palabras activas para los juegos
router.get("/active-words", async (req, res) => {
  const queries = {
    book: "SELECT * FROM book_words WHERE is_active = 1",
    verbs: "SELECT * FROM verbs WHERE is_active = 1",
    spelling: "SELECT * FROM spelling_words WHERE is_active = 1",
    nouns: "SELECT * FROM nouns WHERE is_active = 1",
    adjectives: "SELECT * FROM adjectives WHERE is_active = 1"
  };

  try {
    const [book, verbs, spelling, nouns, adjectives] = await Promise.all([
      new Promise((resolve, reject) => db.all(queries.book, (err, rows) => err ? reject(err) : resolve(rows))),
      new Promise((resolve, reject) => db.all(queries.verbs, (err, rows) => err ? reject(err) : resolve(rows))),
      new Promise((resolve, reject) => db.all(queries.spelling, (err, rows) => err ? reject(err) : resolve(rows))),
      new Promise((resolve, reject) => db.all(queries.nouns, (err, rows) => err ? reject(err) : resolve(rows))),
      new Promise((resolve, reject) => db.all(queries.adjectives, (err, rows) => err ? reject(err) : resolve(rows)))
    ]);

    res.json({
      book,
      verbs,
      spelling,
      nouns,
      adjectives
    });
  } catch (error) {
    console.error("Error al obtener palabras activas:", error);
    res.status(500).json({ error: "Error al cargar las palabras del juego" });
  }
});

module.exports = router;