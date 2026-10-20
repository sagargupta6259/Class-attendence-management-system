import mongoose from "mongoose";
import { isDbConnected, memoryAttendance, makeChainable } from "./store.js";

const AttendanceModel = mongoose.models.Attendance || mongoose.model("Attendance", new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  date: String,
  records: [{ student: mongoose.Schema.Types.ObjectId, rollNumber: String, name: String, status: String }]
}));

const Attendance = {
  find: (filter = {}) => {
    if (isDbConnected()) return AttendanceModel.find(filter);
    const result = filter.subject
      ? memoryAttendance.filter(a => a.subject.toString() === filter.subject.toString())
      : memoryAttendance;
    return makeChainable(Promise.resolve(result));
  },
  findOne: async (query = {}) => {
    if (isDbConnected()) return AttendanceModel.findOne(query);
    return memoryAttendance.find(a =>
      a.subject.toString() === query.subject?.toString() && a.date === query.date
    ) || null;
  },
  findOneAndUpdate: async (query, update) => {
    if (isDbConnected()) return AttendanceModel.findOneAndUpdate(query, update, { upsert: true, new: true });
    let existing = memoryAttendance.find(a =>
      a.subject.toString() === query.subject?.toString() && a.date === query.date
    );
    if (existing) {
      existing.records = update.records;
      return existing;
    }
    const newRecord = { _id: "a_" + Date.now(), subject: query.subject, date: query.date, records: update.records };
    memoryAttendance.push(newRecord);
    return newRecord;
  },
  deleteMany: async (query = {}) => {
    if (isDbConnected()) return AttendanceModel.deleteMany(query);
    if (query.subject) {
      for (let i = memoryAttendance.length - 1; i >= 0; i--) {
        if (memoryAttendance[i].subject.toString() === query.subject.toString()) {
          memoryAttendance.splice(i, 1);
        }
      }
    }
    return { deletedCount: 1 };
  }
};

export default Attendance;
