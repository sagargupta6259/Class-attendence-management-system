import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function ShortageList() {
  const [shortages, setShortages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetch("/api/attendance/shortage")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load shortage list");
        return res.json();
      })
      .then((data) => {
        setShortages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const filteredShortages = filterSemester
    ? shortages.filter((item) => item.semester === filterSemester)
    : shortages;

  return (
    <div>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Attendance Shortage List (&lt; 75%)</h1>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="notice-box" style={{ marginBottom: "20px" }}>
          <strong>Shortage Policy:</strong> Students with attendance below 75% in any subject are listed below. The consecutive classes needed calculation helps advise students how many classes they must attend without missing any to reach 75%.
        </div>

        <div className="card">
          <div className="filters-bar" style={{ marginBottom: "16px" }}>
            <div className="form-group" style={{ maxWidth: "250px" }}>
              <label>Filter by Semester</label>
              <select
                className="form-control"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p>Loading shortage list...</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Sem / Sec</th>
                    <th>Subject</th>
                    <th>Attended / Total</th>
                    <th>Percentage</th>
                    <th>Consecutive Classes Needed (to reach 75%)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShortages.length > 0 ? (
                    filteredShortages.map((item, index) => (
                      <tr key={index} style={{ backgroundColor: "#fff5f5" }}>
                        <td><strong>{item.rollNumber}</strong></td>
                        <td>{item.studentName}</td>
                        <td>Sem {item.semester} - {item.section}</td>
                        <td>{item.subjectName} ({item.subjectCode})</td>
                        <td>{item.attendedClasses} / {item.totalClasses}</td>
                        <td>
                          <span className="badge badge-absent" style={{ fontSize: "13px" }}>
                            {item.percentage}%
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: "#dc2626" }}>
                            {item.classesNeeded} {item.classesNeeded === 1 ? "class" : "classes"}
                          </strong>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "#166534", padding: "20px" }}>
                        No students with shortage found. All students maintain 75% or higher!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShortageList;
