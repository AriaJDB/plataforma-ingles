const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS book_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      english TEXT NOT NULL,
      spanish TEXT NOT NULL,
      month INTEGER,
      week INTEGER,
      category TEXT,
      topic TEXT,
      page INTEGER,
      phonetic TEXT,
      is_active INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS spelling_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      english TEXT NOT NULL,
      spanish TEXT NOT NULL,
      phonetic TEXT,
      is_active INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS verbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spanish TEXT NOT NULL,
      present TEXT NOT NULL,
      past_simple TEXT NOT NULL,
      past_participle TEXT NOT NULL,
      gerund TEXT NOT NULL,
      third_person TEXT NOT NULL,
      phonetic TEXT NOT NULL,
      type TEXT CHECK(type IN ('REGULAR','IRREGULAR')) NOT NULL,
      is_active INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS nouns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spanish TEXT NOT NULL,
      english TEXT NOT NULL,
      plural TEXT NOT NULL,
      phonetic TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS adjectives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spanish TEXT NOT NULL,
      english TEXT NOT NULL,
      comparative TEXT NOT NULL,
      superlative TEXT NOT NULL,
      phonetic TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      is_active INTEGER DEFAULT 1
    )
  `);

});

db.close();