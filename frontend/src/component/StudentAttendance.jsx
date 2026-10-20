import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function StudentAttendance() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    fetch(`/api/attendance/student/${user._id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch attendance summary");
        return res.json();
      })
      .then((data) => {
        setStudentData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Attendance Summary</h1>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading attendance data...</p>
        ) : studentData ? (
          <>
            <div className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                <div><strong>Student Name:</strong> {studentData.student.name}</div>
                <div><strong>Roll Number:</strong> {studentData.student.rollNumber}</div>
                <div><strong>Semester:</strong> Semester {studentData.student.semester}</div>
                <div><strong>Section:</strong> Section {studentData.student.section}</div>
              </div>
            </div>

            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Enrolled Subjects</h2>

            <div className="subject-grid">
              {studentData.subjects && studentData.subjects.length > 0 ? (
                studentData.subjects.map((sub) => (
                  <div key={sub.subjectId} className="subject-card">
                    <div>
                      <h4>{sub.name}</h4>
                      <div className="sub-meta">
                        Code: {sub.code} | Teacher: {sub.teacherName}
                      </div>

                      <div className="stats-row">
                        <div>
                          <small style={{ color: "#6b7280", display: "block" }}>Classes</small>
                          <strong>{sub.attendedClasses} / {sub.totalClasses}</strong>
                        </div>

                        <div>
                          <small style={{ color: "#6b7280", display: "block" }}>Percentage</small>
                          <span
                            className={`attendance-percentage ${
                              sub.percentage >= 75 ? "safe" : "danger"
                            }`}
                          >
                            {sub.percentage}%
                          </span>
                        </div>
                      </div>

                      {sub.isShortage ? (
                        <div className="notice-box" style={{ marginTop: "0", marginBottom: "14px" }}>
                          <strong>Shortage Warning!</strong>
                          <br />
                          Attend next <strong>{sub.classesNeeded}</strong> consecutive{" "}
                          {sub.classesNeeded === 1 ? "class" : "classes"} to reach 75%.
                        </div>
                      ) : sub.totalClasses > 0 ? (
                        <div
                          style={{
                            backgroundColor: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            color: "#166534",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            marginBottom: "14px"
                          }}
                        >
                          Attendance on track (&gt;= 75%)
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            color: "#6b7280",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            marginBottom: "14px"
                          }}
                        >
                          No classes conducted yet
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/my-attendance/${sub.subjectId}`}
                      className="btn btn-primary btn-sm btn-block"
                    >
                      View Date-wise Details &rarr;
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ color: "#6b7280" }}>No subjects found for Semester {studentData.student.semester}.</p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default StudentAttendance;
