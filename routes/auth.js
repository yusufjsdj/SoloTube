import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ username, email, password: hashed });

  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.redirect("/login");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.redirect("/login");

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);
  res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
