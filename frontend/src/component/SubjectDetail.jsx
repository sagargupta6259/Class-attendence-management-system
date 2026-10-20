import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function SubjectDetail() {
  const { subjectId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`/api/attendance/student/${user._id}/subject/${subjectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load subject details");
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
  }, [subjectId, navigate]);

  return (
    <div>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Date-wise Subject Attendance</h1>
          <Link to="/my-attendance" className="btn btn-outline">
            &larr; Back to My Attendance
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading records...</p>
        ) : data ? (
          <>
            <div className="card" style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{data.subject.name}</h2>
              <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                Code: {data.subject.code} | Teacher: {data.subject.teacherName} | Semester: {data.subject.semester}
              </p>

              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", borderTop: "1px solid #e5e7eb", paddingTop: "14px" }}>
                <div>
                  <small style={{ color: "#6b7280", display: "block" }}>Total Classes Held</small>
                  <strong>{data.total}</strong>
                </div>
                <div>
                  <small style={{ color: "#6b7280", display: "block" }}>Classes Attended</small>
                  <strong>{data.attended}</strong>
                </div>
                <div>
                  <small style={{ color: "#6b7280", display: "block" }}>Overall Percentage</small>
                  <strong style={{ color: data.percentage >= 75 ? "#16a34a" : "#dc2626", fontSize: "16px" }}>
                    {data.percentage}%
                  </strong>
                </div>
              </div>

              {data.percentage < 75 && data.total > 0 && (
                <div className="notice-box">
                  <strong>Notice:</strong> Your attendance is below 75%. You must attend the next{" "}
                  <strong>{data.classesNeeded}</strong> consecutive{" "}
                  {data.classesNeeded === 1 ? "class" : "classes"} without missing to reach 75%.
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ fontSize: "16px", marginBottom: "14px" }}>Attendance History</h3>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.records && data.records.length > 0 ? (
                      data.records.map((rec, index) => (
                        <tr key={index}>
                          <td>{rec.date}</td>
                          <td>
                            <span
                              className={`badge ${
                                rec.status === "Present" ? "badge-present" : "badge-absent"
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ textAlign: "center", color: "#6b7280" }}>
                          No attendance sessions conducted for this subject yet.
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

export default SubjectDetail;
