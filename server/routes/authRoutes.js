import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: "Registration successful", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { name: email }], password });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });
  res.json({ message: "Login successful", user });
});

export default router;
