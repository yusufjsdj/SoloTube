import sqlite3 from "sqlite3";
sqlite3.verbose();

export const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      isAdmin INTEGER DEFAULT 0
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS music (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      file TEXT
    );
  `);

  // Admin hesabı otomatik oluşturulur
  db.get(`SELECT * FROM users WHERE email = ?`, ["admin@mail.com"], (err, row) => {
    if (!row) {
      db.run(
        `INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)`,
        ["admin@mail.com", "1234", 1]
      );
      console.log("Admin oluşturuldu: admin@mail.com / 1234");
    }
  });
});
