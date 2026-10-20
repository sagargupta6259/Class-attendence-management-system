import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Login from "./component/Login.jsx";
import Register from "./component/Register.jsx";
import AdminDashboard from "./component/AdminDashboard.jsx";
import SubjectList from "./component/SubjectList.jsx";
import SubjectForm from "./component/SubjectForm.jsx";
import MarkAttendance from "./component/MarkAttendance.jsx";
import ShortageList from "./component/ShortageList.jsx";
import StudentAttendance from "./component/StudentAttendance.jsx";
import SubjectDetail from "./component/SubjectDetail.jsx";
import StudentList from "./component/StudentList.jsx";

function Main() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentList />} />
          <Route path="/admin/subjects" element={<SubjectList />} />
          <Route path="/admin/subjects/new" element={<SubjectForm />} />
          <Route path="/admin/subjects/:id/edit" element={<SubjectForm />} />
          <Route path="/admin/attendance/mark" element={<MarkAttendance />} />
          <Route path="/admin/shortage" element={<ShortageList />} />
          <Route path="/my-attendance" element={<StudentAttendance />} />
          <Route path="/my-attendance/:subjectId" element={<SubjectDetail />} />

          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/subject" element={<Navigate to="/admin/subjects" replace />} />
          <Route path="/attendance" element={<Navigate to="/admin/attendance/mark" replace />} />
          <Route path="/report" element={<Navigate to="/admin/shortage" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
