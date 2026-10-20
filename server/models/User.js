import mongoose from "mongoose";
import { isDbConnected, memoryUsers } from "./store.js";

const UserModel = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, default: "123" },
  role: { type: String, default: "student" },
  rollNumber: String,
  semester: String,
  section: String
}));

const User = {
  find: async (filter = {}) => {
    if (isDbConnected()) return UserModel.find(filter).sort({ rollNumber: 1 });
    return memoryUsers.filter(u => (!filter.role || u.role === filter.role) && (!filter.semester || u.semester === filter.semester));
  },
  findOne: async (query = {}) => {
    if (isDbConnected()) return UserModel.findOne(query);
    const { email, password, $or } = query;
    return memoryUsers.find(u => {
      const matchEmail = $or ? $or.some(o => o.email === u.email || o.name === u.name) : u.email === email;
      const matchPass = !password || u.password === password;
      return matchEmail && matchPass;
    }) || null;
  },
  findById: async (id) => {
    if (isDbConnected()) return UserModel.findById(id);
    return memoryUsers.find(u => u._id.toString() === id?.toString()) || null;
  },
  create: async (data) => {
    if (isDbConnected()) return UserModel.create(data);
    const newUser = { _id: "u_" + Date.now(), ...data };
    memoryUsers.push(newUser);
    return newUser;
  },
  findByIdAndDelete: async (id) => {
    if (isDbConnected()) return UserModel.findByIdAndDelete(id);
    const idx = memoryUsers.findIndex(u => u._id.toString() === id?.toString());
    if (idx !== -1) memoryUsers.splice(idx, 1);
    return { _id: id };
  }
};

export default User;
