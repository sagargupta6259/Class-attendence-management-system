import mongoose from "mongoose";
import { memorySubjects, makeChainable } from "./store.js";

const SubjectModel = mongoose.models.Subject || mongoose.model("Subject", new mongoose.Schema({
  name: String,
  code: String,
  semester: String,
  teacherName: String
}, { timestamps: true }));

const Subject = {
  find: (filter = {}) => {
    if (mongoose.connection.readyState === 1) {
      return SubjectModel.find(filter).sort({ semester: 1 });
    }
    const result = memorySubjects.filter(s => !filter.semester || s.semester === filter.semester);
    return makeChainable(Promise.resolve(result));
  },
  findById: async (id) => {
    if (mongoose.connection.readyState === 1) {
      return SubjectModel.findById(id);
    }
    return memorySubjects.find(s => s._id.toString() === id?.toString()) || null;
  },
  create: async (data) => {
    if (mongoose.connection.readyState === 1) {
      return SubjectModel.create(data);
    }
    const newSubject = { _id: "s_" + Date.now(), ...data };
    memorySubjects.push(newSubject);
    return newSubject;
  },
  findByIdAndUpdate: async (id, data) => {
    if (mongoose.connection.readyState === 1) {
      return SubjectModel.findByIdAndUpdate(id, data, { new: true });
    }
    const s = memorySubjects.find(item => item._id.toString() === id?.toString());
    if (s) Object.assign(s, data);
    return s || null;
  },
  findByIdAndDelete: async (id) => {
    if (mongoose.connection.readyState === 1) {
      return SubjectModel.findByIdAndDelete(id);
    }
    const idx = memorySubjects.findIndex(s => s._id.toString() === id?.toString());
    if (idx !== -1) memorySubjects.splice(idx, 1);
    return { _id: id };
  }
};

export default Subject;
