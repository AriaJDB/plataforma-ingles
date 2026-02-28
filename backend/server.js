const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));

// Rutas
app.use("/book-words", require("./routes/bookWords"));
app.use("/spelling-words", require("./routes/spellingWords"));
app.use("/students", require("./routes/students"));
app.use("/verbs",require ("./routes/verbs"))
app.use("/adjectives",require ("./routes/adjectives"))
app.use("/nouns",require ("./routes/nouns"))
app.use("/game-manager", require("./routes/gameManager"));

app.listen(3001, () => {
  console.log("Servidor activo en puerto 3001");
});