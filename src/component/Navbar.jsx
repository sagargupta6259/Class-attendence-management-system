import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user ? (user.role === "admin" ? "/admin/dashboard" : "/my-attendance") : "/login"}>
          Attendance System
        </Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/students">Students</Link>
                <Link to="/admin/subjects">Subjects</Link>
                <Link to="/admin/attendance/mark">Mark Attendance</Link>
                <Link to="/admin/shortage">Shortage List</Link>
              </>
            ) : (
              <Link to="/my-attendance">My Attendance</Link>
            )}

            <span className="navbar-user">
              {user.name} ({user.role})
            </span>

            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;