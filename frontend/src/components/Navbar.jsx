import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>PMS</div>
      <div style={styles.right}>
        <Link to="/admin-register" style={styles.link}>Admin Register</Link>
        <Link to="/employee-register" style={styles.link}>Employee Register</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    height: "60px",
    backgroundColor: "#1e40af",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1.5rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  left: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  right: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 500,
  },
};

export default Navbar;