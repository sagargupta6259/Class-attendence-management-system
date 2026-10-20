import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = { role: "student" };
  if (req.query.semester) filter.semester = req.query.semester;
  res.json(await User.find(filter).sort({ rollNumber: 1 }));
});

router.post("/", async (req, res) => {
  try {
    const student = await User.create({ ...req.body, role: "student" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

export default router;
