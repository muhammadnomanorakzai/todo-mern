import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ToastNotification from "../../components/shared/ToastNotification";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../public/css/login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setToast({
        show: true,
        message: result.message || "Login failed",
        type: "error",
      });
    }
  };

  const inputVariants = {
    focused: { scale: 1.02, transition: { duration: 0.2 } },
    blurred: { scale: 1, transition: { duration: 0.2 } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="position-relative min-vh-100 d-flex align-items-center justify-content-center overflow-hidden"
      style={{
        background:
          "linear-gradient(-45deg, #667eea, #764ba2, #6b8cff, #9f7aea)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
      }}>
      {/* Animated background shapes */}
      <div
        className="floating-shape"
        style={{
          width: "400px",
          height: "400px",
          top: "5%",
          left: "5%",
          animationDelay: "0s",
        }}
      />
      <div
        className="floating-shape"
        style={{
          width: "300px",
          height: "300px",
          bottom: "10%",
          right: "5%",
          animationDelay: "2s",
        }}
      />
      <div
        className="floating-shape"
        style={{
          width: "250px",
          height: "250px",
          top: "20%",
          right: "15%",
          animationDelay: "4s",
        }}
      />
      <div
        className="floating-shape"
        style={{
          width: "350px",
          height: "350px",
          bottom: "20%",
          left: "10%",
          animationDelay: "1s",
        }}
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="glass-card p-4 p-md-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="text-center mb-4">
                <h2 className="display-6 fw-bold welcome-text mb-2">
                  Welcome Back
                </h2>
                <p className="text-muted">Sign in to continue your journey</p>
              </motion.div>

              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="floating-label-group">
                  <label
                    htmlFor="email"
                    className={`floating-label ${focusedField === "email" || formData.email ? "active" : ""}`}>
                    Email Address
                  </label>
                  <motion.div
                    variants={inputVariants}
                    animate={focusedField === "email" ? "focused" : "blurred"}>
                    <input
                      type="email"
                      className="form-control-custom"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder=" "
                      autoComplete="email"
                    />
                  </motion.div>
                </div>

                {/* Password Field */}
                <div className="floating-label-group">
                  <label
                    htmlFor="password"
                    className={`floating-label ${focusedField === "password" || formData.password ? "active" : ""}`}>
                    Password
                  </label>
                  <motion.div
                    variants={inputVariants}
                    animate={
                      focusedField === "password" ? "focused" : "blurred"
                    }>
                    <input
                      type="password"
                      className="form-control-custom"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength="6"
                      placeholder=" "
                      autoComplete="current-password"
                    />
                  </motion.div>
                  <div className="help-text">Must be at least 6 characters</div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-end mb-4">
                  <Link to="/forgot-password" className="link-custom small">
                    Forgot Password?
                  </Link>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <button
                    type="submit"
                    className="btn-custom w-100"
                    disabled={loading}>
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </motion.div>

                <div className="text-center mt-4">
                  <p className="mb-0 text-muted">
                    Don't have an account?{" "}
                    <Link to="/register" className="link-custom">
                      Create account
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-4">
              <p className="text-white-50 small mb-0">
                Protected by enterprise-grade security
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast.show && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
            duration={3000}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Login;
