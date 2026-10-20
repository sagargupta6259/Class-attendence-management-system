import mongoose from "mongoose";

const Subject = mongoose.model("Subject", new mongoose.Schema({
  name: String,
  code: String,
  semester: String,
  teacherName: String
}));

export default Subject;
