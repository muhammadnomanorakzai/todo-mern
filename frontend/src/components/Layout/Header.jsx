import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(135deg, #0d6efd)",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
      }}>
      <div className="container">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-grid-3x3-gap-fill me-2"></i>
            TaskFlow
          </Link>
        </motion.div>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="nav-item me-3">
                  <span className="nav-link text-white opacity-75">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.email}
                  </span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="nav-item">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline-light rounded-pill px-4"
                    onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </motion.button>
                </motion.li>
              </>
            ) : (
              <>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="nav-item me-2">
                  <Link className="nav-link text-white" to="/login">
                    Login
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="nav-item">
                  <Link
                    className="btn btn-light rounded-pill px-4"
                    to="/register"
                    style={{ color: "#667eea" }}>
                    Register
                  </Link>
                </motion.li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;
