import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadSubjects();
  }, [navigate]);

  function loadSubjects() {
    setLoading(true);
    fetch("/api/subjects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load subjects");
        return res.json();
      })
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete subject");
      }

      setSubjects(subjects.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Manage Subjects</h1>
          <Link to="/admin/subjects/new" className="btn btn-primary">
            + Add New Subject
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          {loading ? (
            <p>Loading subjects...</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Subject Code</th>
                    <th>Semester</th>
                    <th>Teacher Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length > 0 ? (
                    subjects.map((sub) => (
                      <tr key={sub._id}>
                        <td><strong>{sub.name}</strong></td>
                        <td>{sub.code}</td>
                        <td>Semester {sub.semester}</td>
                        <td>{sub.teacherName}</td>
                        <td>
                          <div className="actions-cell">
                            <Link
                              to={`/admin/subjects/${sub._id}/edit`}
                              className="btn btn-sm btn-outline"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(sub._id, sub.name)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", color: "#6b7280" }}>
                        No subjects found. Click "+ Add New Subject" to create one.
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

export default SubjectList;
