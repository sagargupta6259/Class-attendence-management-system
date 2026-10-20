import express from "express";
import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

router.get("/", async (req, res) => res.json(await Subject.find().sort({ semester: 1 })));
router.get("/:id", async (req, res) => res.json(await Subject.findById(req.params.id)));
router.post("/", async (req, res) => res.json(await Subject.create(req.body)));
router.put("/:id", async (req, res) => res.json(await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })));

router.delete("/:id", async (req, res) => {
  await Attendance.deleteMany({ subject: req.params.id });
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ message: "Subject deleted" });
});

export default router;
