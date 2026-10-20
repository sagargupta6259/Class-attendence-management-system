import mongoose from "mongoose";

const Attendance = mongoose.model("Attendance", new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  date: String,
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rollNumber: String,
    name: String,
    status: { type: String, default: "Present" }
  }]
}));

export default Attendance;
