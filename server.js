import express from "express";
import cors from "cors";
import multer from "multer";
import bcrypt from "bcryptjs";
import { db } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

// ----------------------- KAYIT -----------------------
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (row) return res.json({ error: "Bu email zaten kayıtlı" });

    const hash = bcrypt.hashSync(password, 10);

    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash],
      () => res.json({ success: true })
    );
  });
});

// ----------------------- GİRİŞ -----------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) return res.json({ error: "Kullanıcı bulunamadı" });

    if (!bcrypt.compareSync(password, user.password))
      return res.json({ error: "Şifre yanlış" });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  });
});

// ----------------------- MÜZİK YÜKLE (Sadece Admin) -----------------------
app.post("/upload", upload.single("music"), (req, res) => {
  const { title } = req.body;
  const file = req.file.filename;

  db.run(
    "INSERT INTO music (title, file) VALUES (?, ?)",
    [title, file],
    () => res.json({ success: true })
  );
});

// ----------------------- MÜZİK LİSTELE -----------------------
app.get("/music", (req, res) => {
  db.all("SELECT * FROM music", [], (err, rows) => {
    res.json(rows);
  });
});

// ----------------------- SERVER -----------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server çalışıyor → PORT: " + port);
});
