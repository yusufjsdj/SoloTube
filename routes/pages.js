import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => res.render("index"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));
router.get("/dashboard", verifyUser, (req, res) =>
  res.render("dashboard", { user: req.user })
);

export default router;
