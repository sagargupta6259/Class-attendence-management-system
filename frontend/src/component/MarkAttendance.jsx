import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubjectId(data[0]._id);
        }
      })
      .catch(() => {
        setMessage({ text: "Failed to load subjects", type: "danger" });
      });
  }, [navigate]);

  useEffect(() => {
    if (!selectedSubjectId || !selectedDate) return;

    const sub = subjects.find((s) => s._id === selectedSubjectId);
    if (!sub) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    fetch(`/api/attendance/check?subjectId=${selectedSubjectId}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((checkData) => {
        if (checkData.exists && checkData.attendance) {
          setIsEditMode(true);
          setStudents(checkData.attendance.records);
          setMessage({
            text: "Attendance already marked for this date. Opened in Edit Mode.",
            type: "info"
          });
          setLoading(false);
        } else {
          setIsEditMode(false);
          return fetch(`/api/students?semester=${sub.semester}`)
            .then((res) => res.json())
            .then((studentList) => {
              const records = studentList.map((st) => ({
                student: st._id,
                rollNumber: st.rollNumber,
                name: st.name,
                status: "Present"
              }));
              setStudents(records);
              setLoading(false);
            });
        }
      })
      .catch(() => {
        setMessage({ text: "Error checking attendance record", type: "danger" });
        setLoading(false);
      });
  }, [selectedSubjectId, selectedDate, subjects]);

  function handleStatusChange(studentId, newStatus) {
    setStudents((prev) =>
      prev.map((item) =>
        item.student === studentId ? { ...item, status: newStatus } : item
      )
    );
  }

  function markAll(status) {
    setStudents((prev) => prev.map((item) => ({ ...item, status })));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!selectedSubjectId || !selectedDate || students.length === 0) {
      setMessage({ text: "Please select subject, date and ensure students are listed", type: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubjectId,
          date: selectedDate,
          records: students
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save attendance");

      setMessage({
        text: isEditMode
          ? "Attendance updated successfully!"
          : "Attendance recorded successfully!",
        type: "success"
      });
      setIsEditMode(true);
      setLoading(false);
    } catch (err) {
      setMessage({ text: err.message, type: "danger" });
      setLoading(false);
    }
  }

  const currentSubject = subjects.find((s) => s._id === selectedSubjectId);

  return (
    <div>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Mark Subject Attendance</h1>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="card">
          <div className="filters-bar">
            <div className="form-group">
              <label>Select Subject</label>
              <select
                className="form-control"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.code}) - Sem {sub.semester}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {currentSubject && (
            <div style={{ marginBottom: "16px", fontSize: "14px", color: "#4b5563" }}>
              <strong>Subject:</strong> {currentSubject.name} |{" "}
              <strong>Teacher:</strong> {currentSubject.teacherName} |{" "}
              <strong>Semester:</strong> {currentSubject.semester}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "16px" }}>
              Students of Semester {currentSubject ? currentSubject.semester : ""} ({students.length})
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => markAll("Present")}
              >
                Mark All Present
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => markAll("Absent")}
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading attendance sheet...</p>
          ) : students.length === 0 ? (
            <p style={{ color: "#6b7280", padding: "16px 0" }}>
              No students registered in Semester {currentSubject?.semester || ""}.
            </p>
          ) : (
            <form onSubmit={handleSave}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Roll Number</th>
                      <th>Student Name</th>
                      <th>Status Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st) => (
                      <tr key={st.student}>
                        <td><strong>{st.rollNumber}</strong></td>
                        <td>{st.name}</td>
                        <td>
                          <div className="toggle-group">
                            <button
                              type="button"
                              className={`toggle-btn present ${st.status === "Present" ? "active" : ""}`}
                              onClick={() => handleStatusChange(st.student, "Present")}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              className={`toggle-btn absent ${st.status === "Absent" ? "active" : ""}`}
                              onClick={() => handleStatusChange(st.student, "Absent")}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ minWidth: "180px" }}
                  disabled={loading}
                >
                  {isEditMode ? "Update Attendance" : "Save Attendance"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;
