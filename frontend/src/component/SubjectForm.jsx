import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function SubjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    if (isEdit) {
      fetch(`/api/subjects/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not find subject");
          return res.json();
        })
        .then((data) => {
          setName(data.name || "");
          setCode(data.code || "");
          setSemester(data.semester || "");
          setTeacherName(data.teacherName || "");
          setFetching(false);
        })
        .catch((err) => {
          setError(err.message);
          setFetching(false);
        });
    }
  }, [id, isEdit, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { name, code, semester, teacherName };

    try {
      const url = isEdit ? `/api/subjects/${id}` : "/api/subjects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Operation failed");
        setLoading(false);
        return;
      }

      navigate("/admin/subjects");
    } catch {
      setError("Failed to save subject. Please check connection.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">{isEdit ? "Edit Subject" : "Add New Subject"}</h1>
          <Link to="/admin/subjects" className="btn btn-outline">
            Back to List
          </Link>
        </div>

        <div className="form-container" style={{ margin: "0 auto" }}>
          {error && <div className="alert alert-danger">{error}</div>}

          {fetching ? (
            <p>Loading subject details...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Operating Systems"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CS403"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Semester</label>
                <select
                  className="form-control"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  <option value="">Select Semester</option>
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

              <div className="form-group">
                <label>Teacher Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Prof. Gupta"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? "Saving..." : isEdit ? "Update Subject" : "Create Subject"}
                </button>
                <Link to="/admin/subjects" className="btn btn-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectForm;
