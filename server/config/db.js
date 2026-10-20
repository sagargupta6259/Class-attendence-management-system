import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendance_db")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("DB Error:", err));
};

export default connectDB;
