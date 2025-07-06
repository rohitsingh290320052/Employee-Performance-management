import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Performance <br />Management System</h1>
        <p className="home-subtitle">
          Streamline your workforce performance with our comprehensive management platform
        </p>

        <div className="feature-badges">
          <span>📊 Goal Tracking</span>
          <span>📝 Performance Reviews</span>
          <span>📈 Analytics</span>
        </div>

        <div className="card-section">
          <div className="login-card">
            <div className="icon">👥</div>
            <h2>Employee Portal</h2>
            <p>Access your performance dashboard, goals, and feedback</p>
            <Link to="/employee-login" className="login-btn emp">Employee Login →</Link>
          </div>

          <div className="login-card">
            <div className="icon">🛡️</div>
            <h2>Admin Portal</h2>
            <p>Manage teams, reviews, and organizational performance</p>
            <Link to="/admin-login" className="login-btn admin">Admin Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
