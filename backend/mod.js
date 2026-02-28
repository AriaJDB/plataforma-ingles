const db = require("./db");

db.serialize(() => {
  const tablas = [
    "book_words",
    "spelling_words",
    "verbs",
    "nouns",
    "adjectives"
  ];

  tablas.forEach((tabla) => {
    // 1. Eliminamos la columna (Requiere SQLite 3.35.0+)
    db.run(`ALTER TABLE ${tabla} DROP COLUMN is_active`, (err) => {
      if (err) {
        console.log(`Nota: No se pudo borrar en ${tabla} (quizás ya no existe), procediendo a crearla.`);
      }

      // 2. Volvemos a añadir la columna con valor por defecto 1 (Activo)
      db.run(`ALTER TABLE ${tabla} ADD COLUMN is_active INTEGER DEFAULT 1`, (err) => {
        if (!err) {
          // 3. Forzamos que todos los registros viejos pasen a ser 1
          db.run(`UPDATE ${tabla} SET is_active = 1`);
          console.log(`Columna is_active reseteada en tabla: ${tabla}`);
        }
      });
    });
  });
});