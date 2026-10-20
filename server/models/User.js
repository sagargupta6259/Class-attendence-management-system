import mongoose from "mongoose";

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, default: "123" },
  role: { type: String, default: "student" },
  rollNumber: String,
  semester: String,
  section: String
}));

export default User;
