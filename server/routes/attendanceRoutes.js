import express from "express";
import Attendance from "../models/Attendance.js";
import Subject from "../models/Subject.js";
import User from "../models/User.js";

const router = express.Router();

const getStats = (attended, total) => ({
  percentage: total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 0,
  classesNeeded: total > 0 && (attended / total) < 0.75 ? Math.ceil(3 * total - 4 * attended) : 0,
  isShortage: total > 0 && (attended / total) < 0.75
});

// Check Attendance
router.get("/check", async (req, res) => {
  const attendance = await Attendance.findOne({ subject: req.query.subjectId, date: req.query.date });
  res.json({ exists: !!attendance, attendance });
});

// Mark Attendance
router.post("/mark", async (req, res) => {
  const { subjectId, date, records } = req.body;
  const attendance = await Attendance.findOneAndUpdate(
    { subject: subjectId, date },
    { records },
    { upsert: true, new: true }
  );
  res.json({ message: "Attendance saved", attendance });
});

// Student Attendance Summary
router.get("/student/:studentId", async (req, res) => {
  const student = await User.findById(req.params.studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const [subjects, list] = await Promise.all([
    Subject.find({ semester: student.semester }),
    Attendance.find()
  ]);

  const subjectSummaries = subjects.map((sub) => {
    const subAtt = list.filter((a) => a.subject?.toString() === sub._id.toString());
    const attended = subAtt.filter((a) => a.records.some((r) => r.student?.toString() === student._id.toString() && r.status === "Present")).length;
    return {
      subjectId: sub._id, name: sub.name, code: sub.code, semester: sub.semester, teacherName: sub.teacherName,
      totalClasses: subAtt.length, attendedClasses: attended, ...getStats(attended, subAtt.length)
    };
  });

  res.json({ student, subjects: subjectSummaries });
});

// Student Subject Detail
router.get("/student/:studentId/subject/:subjectId", async (req, res) => {
  const { studentId, subjectId } = req.params;
  const [student, subject, list] = await Promise.all([
    User.findById(studentId),
    Subject.findById(subjectId),
    Attendance.find({ subject: subjectId }).sort({ date: -1 })
  ]);
  if (!student || !subject) return res.status(404).json({ message: "Not found" });

  let attended = 0;
  const records = list.map((a) => {
    const rec = a.records.find((r) => r.student?.toString() === studentId);
    const status = rec?.status || "Absent";
    if (status === "Present") attended++;
    return { date: a.date, status };
  });

  res.json({ student, subject, total: list.length, attended, records, ...getStats(attended, list.length) });
});

// Shortage List (< 75%)
router.get("/shortage", async (req, res) => {
  const [students, subjects, list] = await Promise.all([
    User.find({ role: "student" }).sort({ rollNumber: 1 }),
    Subject.find(),
    Attendance.find()
  ]);

  const shortageList = [];
  subjects.forEach((sub) => {
    const subAtt = list.filter((a) => a.subject?.toString() === sub._id.toString());
    if (!subAtt.length) return;

    students.filter((s) => s.semester === sub.semester).forEach((st) => {
      const attended = subAtt.filter((a) => a.records.some((r) => r.student?.toString() === st._id.toString() && r.status === "Present")).length;
      const stats = getStats(attended, subAtt.length);
      if (stats.isShortage) {
        shortageList.push({
          studentId: st._id, studentName: st.name, rollNumber: st.rollNumber,
          semester: st.semester, section: st.section, subjectId: sub._id,
          subjectName: sub.name, subjectCode: sub.code, attendedClasses: attended,
          totalClasses: subAtt.length, ...stats
        });
      }
    });
  });

  res.json(shortageList);
});

// Admin Dashboard Summary
router.get("/dashboard", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const [students, subjects, list] = await Promise.all([
    User.find({ role: "student" }),
    Subject.find(),
    Attendance.find()
  ]);

  const activeList = list.filter((a) => a.date === today).length ? list.filter((a) => a.date === today) : list;
  let totalMarks = 0, presentMarks = 0;
  activeList.forEach((a) => a.records.forEach((r) => {
    totalMarks++;
    if (r.status === "Present") presentMarks++;
  }));

  const subjectAverages = subjects.map((sub) => {
    const subAtt = list.filter((a) => a.subject?.toString() === sub._id.toString());
    let t = 0, p = 0;
    subAtt.forEach((a) => a.records.forEach((r) => { t++; if (r.status === "Present") p++; }));
    return {
      _id: sub._id, name: sub.name, code: sub.code, semester: sub.semester, teacherName: sub.teacherName,
      totalClasses: subAtt.length, avgPercentage: t > 0 ? Number(((p / t) * 100).toFixed(1)) : 0
    };
  });

  const shortageSet = new Set();
  subjects.forEach((sub) => {
    const subAtt = list.filter((a) => a.subject?.toString() === sub._id.toString());
    if (!subAtt.length) return;
    students.filter((s) => s.semester === sub.semester).forEach((st) => {
      const attended = subAtt.filter((a) => a.records.some((r) => r.student?.toString() === st._id.toString() && r.status === "Present")).length;
      if ((attended / subAtt.length) * 100 < 75) shortageSet.add(st._id.toString());
    });
  });

  res.json({
    todayDate: today,
    todayOverallPercentage: totalMarks > 0 ? Number(((presentMarks / totalMarks) * 100).toFixed(1)) : 0,
    totalStudents: students.length,
    totalSubjects: subjects.length,
    shortageCount: shortageSet.size,
    subjectAverages
  });
});

export default router;
