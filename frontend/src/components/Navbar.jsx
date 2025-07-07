import { Link } from "react-router-dom";
import { useState } from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo + Icon */}
      <div className="logo">
        <Link to="/" className="icon-link" title="Go to Home">
          <AssessmentIcon
            style={{ fontSize: 28, verticalAlign: "middle", color: "#1e293b" }}
          />
        </Link>
        <Link to="/" className="logo-text">
          PMS
        </Link>
      </div>

      {/* Desktop links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/admin-register" onClick={() => setMenuOpen(false)}>
          Admin Register
        </Link>
        <Link to="/employee-register" onClick={() => setMenuOpen(false)}>
          Employee Register
        </Link>
      </div>

      {/* Mobile hamburger */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
}
