const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/summary", (req, res) => {
  const queries = {
    totalWords: "SELECT COUNT(*) as count FROM (SELECT id FROM verbs UNION ALL SELECT id FROM nouns UNION ALL SELECT id FROM adjectives UNION ALL SELECT id FROM book_words UNION ALL SELECT id FROM spelling_words)",
    totalStudents: "SELECT COUNT(*) as count FROM students",     // Asumiendo que tienes esta tabla
  };

  db.get(queries.totalWords, [], (err, words) => {
    if (err) return res.status(500).json(err);
    
    res.json({
      words: words.count,
      students: 25, // Valores estáticos si aún no tienes las tablas
      teams: 8
    });
  });
});

module.exports = router;