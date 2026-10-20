import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendance_db");
    isConnected = conn.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

export default connectDB;
