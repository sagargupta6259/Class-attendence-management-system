import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetch("/api/attendance/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard data");
        return res.json();
      })
      .then((resData) => {
        setData(resData);
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
          <h1 className="page-title">Admin Dashboard</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/admin/attendance/mark" className="btn btn-primary">
              Mark Attendance
            </Link>
            <Link to="/admin/students" className="btn btn-outline">
              Manage Students
            </Link>
            <Link to="/admin/subjects" className="btn btn-outline">
              Manage Subjects
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading dashboard...</p>
        ) : data ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Today's Attendance</h3>
                <div className="stat-number">{data.todayOverallPercentage}%</div>
                <small style={{ color: "#6b7280" }}>Date: {data.todayDate}</small>
              </div>

              <div className="stat-card">
                <h3>Total Students</h3>
                <div className="stat-number">{data.totalStudents}</div>
                <small style={{ color: "#6b7280" }}>Enrolled</small>
              </div>

              <div className="stat-card">
                <h3>Total Subjects</h3>
                <div className="stat-number">{data.totalSubjects}</div>
                <small style={{ color: "#6b7280" }}>Active courses</small>
              </div>

              <div className="stat-card danger">
                <h3>Shortage Count</h3>
                <div className="stat-number">{data.shortageCount}</div>
                <small style={{ color: "#dc2626" }}>Students below 75%</small>
              </div>
            </div>

            <div className="card">
              <div className="page-header">
                <h2 style={{ fontSize: "18px" }}>Subject-wise Average Attendance</h2>
                <Link to="/admin/shortage" className="btn btn-sm btn-outline">
                  View Shortage List
                </Link>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject Name</th>
                      <th>Code</th>
                      <th>Semester</th>
                      <th>Teacher</th>
                      <th>Total Classes</th>
                      <th>Average Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subjectAverages && data.subjectAverages.length > 0 ? (
                      data.subjectAverages.map((sub) => (
                        <tr key={sub._id}>
                          <td><strong>{sub.name}</strong></td>
                          <td>{sub.code}</td>
                          <td>Sem {sub.semester}</td>
                          <td>{sub.teacherName}</td>
                          <td>{sub.totalClasses}</td>
                          <td>
                            <span
                              className={`badge ${
                                sub.avgPercentage >= 75 ? "badge-present" : "badge-absent"
                              }`}
                            >
                              {sub.avgPercentage}%
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", color: "#6b7280" }}>
                          No subject data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
