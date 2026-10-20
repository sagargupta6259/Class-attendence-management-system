import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSemester, setFilterSemester] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // New Student form state
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    semester: "4",
    section: "A",
    email: "",
    password: "123"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    loadStudents();
  }, [navigate]);

  function loadStudents() {
    setLoading(true);
    fetch("/api/students")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load students");
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.rollNumber) {
      setError("Please fill in Name, Roll Number, and Email.");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add student");
      }

      setSuccess(`Student "${formData.name}" added successfully!`);
      setFormData({
        name: "",
        rollNumber: "",
        semester: "4",
        section: "A",
        email: "",
        password: "123"
      });
      setShowAddForm(false);
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete student "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      setSuccess(`Student "${name}" deleted successfully.`);
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredStudents = students.filter((s) => {
    const matchesSem = filterSemester ? s.semester === filterSemester : true;
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSem && matchesSearch;
  });

  return (
    <div>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Manage Students</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? "Cancel" : "+ Add New Student"}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showAddForm && (
          <div className="card" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Add New Student</h2>
            <form onSubmit={handleAddStudent}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Aman Verma"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    type="text"
                    name="rollNumber"
                    className="form-control"
                    placeholder="e.g. CS-105"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Semester</label>
                  <select
                    name="semester"
                    className="form-control"
                    value={formData.semester}
                    onChange={handleInputChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={String(sem)}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Section</label>
                  <select
                    name="section"
                    className="form-control"
                    value={formData.section}
                    onChange={handleInputChange}
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="e.g. aman@college.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Default Password</label>
                  <input
                    type="text"
                    name="password"
                    className="form-control"
                    placeholder="e.g. 123"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary">
                  Save Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, roll no, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: "300px" }}
              />

              <select
                className="form-control"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                style={{ maxWidth: "180px" }}
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={String(sem)}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div style={{ alignSelf: "center", color: "#6b7280", fontSize: "14px" }}>
              Total Students: <strong>{filteredStudents.length}</strong>
            </div>
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Semester</th>
                    <th>Section</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st) => (
                      <tr key={st._id}>
                        <td><strong>{st.rollNumber || "-"}</strong></td>
                        <td>{st.name}</td>
                        <td>Semester {st.semester || "-"}</td>
                        <td>Section {st.section || "-"}</td>
                        <td style={{ color: "#4b5563" }}>{st.email}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(st._id, st.name)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#6b7280" }}>
                        No students found.
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

export default StudentList;
