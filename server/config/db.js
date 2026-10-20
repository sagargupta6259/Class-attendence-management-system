import mongoose from "mongoose";

const connectDB = async () => {
  if (process.env.VERCEL && !process.env.MONGO_URI) {
    console.log("Vercel Cloud: Running in In-Memory Database Mode");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendance_db", {
      serverSelectionTimeoutMS: 2500
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Using In-Memory Database Mode:", err.message);
  }
};

export default connectDB;
