import mongoose from "mongoose";

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const makeChainable = (promise) => {
  promise.sort = (sortObj) => makeChainable(promise.then(arr => {
    if (!Array.isArray(arr) || !sortObj) return arr;
    const key = Object.keys(sortObj)[0];
    const dir = sortObj[key] === -1 ? -1 : 1;
    return [...arr].sort((a, b) => (a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0));
  }));
  return promise;
};

export let memoryUsers = [
  { _id: "u1", name: "Admin Teacher", email: "admin@college.com", password: "admin", role: "admin", rollNumber: "", semester: "", section: "" },
  { _id: "u2", name: "sagar", email: "sagar@gmail.com", password: "12345", role: "admin", rollNumber: "", semester: "", section: "" },
  { _id: "u3", name: "Rahul Sharma", email: "rahul@college.com", password: "123", role: "student", rollNumber: "CS-101", semester: "4", section: "A" },
  { _id: "u4", name: "Priya Patel", email: "priya@college.com", password: "123", role: "student", rollNumber: "CS-102", semester: "4", section: "A" },
  { _id: "u5", name: "Amit Kumar", email: "amit@college.com", password: "123", role: "student", rollNumber: "CS-103", semester: "4", section: "B" },
  { _id: "u6", name: "Sneha Singh", email: "sneha@college.com", password: "123", role: "student", rollNumber: "CS-104", semester: "4", section: "B" }
];

export let memorySubjects = [
  { _id: "s1", name: "Database Management Systems", code: "CS401", semester: "4", teacherName: "Prof. Verma" },
  { _id: "s2", name: "Computer Networks", code: "CS402", semester: "4", teacherName: "Prof. Sharma" },
  { _id: "s3", name: "Operating Systems", code: "CS403", semester: "4", teacherName: "Prof. Gupta" }
];

const today = new Date().toISOString().split("T")[0];

export let memoryAttendance = [
  {
    _id: "a1", subject: "s1", date: "2026-10-18",
    records: [
      { student: "u3", rollNumber: "CS-101", name: "Rahul Sharma", status: "Present" },
      { student: "u4", rollNumber: "CS-102", name: "Priya Patel", status: "Present" },
      { student: "u5", rollNumber: "CS-103", name: "Amit Kumar", status: "Absent" },
      { student: "u6", rollNumber: "CS-104", name: "Sneha Singh", status: "Present" }
    ]
  },
  {
    _id: "a2", subject: "s1", date: "2026-10-19",
    records: [
      { student: "u3", rollNumber: "CS-101", name: "Rahul Sharma", status: "Absent" },
      { student: "u4", rollNumber: "CS-102", name: "Priya Patel", status: "Present" },
      { student: "u5", rollNumber: "CS-103", name: "Amit Kumar", status: "Absent" },
      { student: "u6", rollNumber: "CS-104", name: "Sneha Singh", status: "Present" }
    ]
  },
  {
    _id: "a3", subject: "s1", date: today,
    records: [
      { student: "u3", rollNumber: "CS-101", name: "Rahul Sharma", status: "Present" },
      { student: "u4", rollNumber: "CS-102", name: "Priya Patel", status: "Present" },
      { student: "u5", rollNumber: "CS-103", name: "Amit Kumar", status: "Absent" },
      { student: "u6", rollNumber: "CS-104", name: "Sneha Singh", status: "Present" }
    ]
  },
  {
    _id: "a4", subject: "s2", date: "2026-10-19",
    records: [
      { student: "u3", rollNumber: "CS-101", name: "Rahul Sharma", status: "Present" },
      { student: "u4", rollNumber: "CS-102", name: "Priya Patel", status: "Present" },
      { student: "u5", rollNumber: "CS-103", name: "Amit Kumar", status: "Present" },
      { student: "u6", rollNumber: "CS-104", name: "Sneha Singh", status: "Absent" }
    ]
  }
];
