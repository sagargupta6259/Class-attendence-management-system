import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/my-attendance");
      }
    } catch {
      setError("Cannot connect to server. Please ensure backend is running.");
      setLoading(false);
    }
  }

  function fillDemo(userEmail, userPass) {
    setEmail(userEmail);
    setPassword(userPass);
  }

  return (
    <div>
      <Navbar />

      <div className="form-container">
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>User Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email or Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter email or name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div className="demo-credentials">
          <p><strong>Demo Accounts (Click to test):</strong></p>
          <p>
            Admin:{" "}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => fillDemo("admin@college.com", "admin")}
            >
              admin@college.com / admin
            </button>
          </p>
          <p style={{ marginTop: "6px" }}>
            Student:{" "}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => fillDemo("rahul@college.com", "123")}
            >
              rahul@college.com / 123
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
