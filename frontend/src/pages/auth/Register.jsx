import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ToastNotification from "../../components/shared/ToastNotification";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setToast({
        show: true,
        message: "All fields are required",
        type: "error",
      });
      return;
    }

    if (formData.password.length < 6) {
      setToast({
        show: true,
        message: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({
        show: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({
        show: true,
        message: "Please enter a valid email address",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
    );

    setLoading(false);

    if (result.success) {
      setToast({
        show: true,
        message: "Registration successful! Redirecting to login...",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setToast({
        show: true,
        message: result.message || "Registration failed",
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
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .floating-shape {
          position: absolute;
          filter: blur(60px);
          opacity: 0.4;
          animation: float 6s ease-in-out infinite;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 20px;
          transition: transform 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-5px);
        }

        .floating-label-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .floating-label {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          padding: 0 0.25rem;
          color: #6c757d;
          transition: all 0.2s ease-out;
          pointer-events: none;
          font-size: 1rem;
          border-radius: 4px;
        }

        .floating-label.active {
          top: -1.4rem;
          left: 0.8rem;
          font-size: 0.85rem;
          color: #0d6efd;
          font-weight: 500;
          background: white;
          padding: 0 0.5rem;
          transform: translateY(0);
        }

        .form-control-custom {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-control-custom:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }

        .form-control-custom:hover {
          border-color: #adb5bd;
        }

        .btn-custom {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-custom::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition:
            width 0.6s,
            height 0.6s;
        }

        .btn-custom:hover:not(:disabled)::before {
          width: 300px;
          height: 300px;
        }

        .btn-custom:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-custom:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-custom:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .help-text {
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 0.25rem;
          margin-left: 1rem;
        }

        .link-custom {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
        }

        .link-custom::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #1a1b22ff 0%, #69181fff 100%);
          transition: width 0.3s ease;
        }

        .link-custom:hover::after {
          width: 100%;
        }

        @media (max-width: 768px) {
          .glass-card {
            margin: 1rem;
            padding: 1rem !important;
          }
        }
      `}</style>

      {/* Animated background shapes */}
      <div
        className="floating-shape"
        style={{ width: "300px", height: "300px", top: "10%", left: "10%" }}
      />
      <div
        className="floating-shape"
        style={{
          width: "400px",
          height: "400px",
          bottom: "10%",
          right: "10%",
          animationDelay: "2s",
        }}
      />
      <div
        className="floating-shape"
        style={{
          width: "200px",
          height: "200px",
          top: "20%",
          right: "20%",
          animationDelay: "1s",
        }}
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
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
                }}>
                <h2
                  className="text-center mb-2 fw-bold"
                  style={{ color: "#2d3748" }}>
                  Create Account
                </h2>
                <p className="text-center text-muted mb-4">
                  Join us today! Get started with your account.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="floating-label-group">
                  <label
                    htmlFor="username"
                    className={`floating-label ${focusedField === "username" || formData.username ? "active" : ""}`}>
                    Username
                  </label>
                  <motion.div
                    variants={inputVariants}
                    animate={
                      focusedField === "username" ? "focused" : "blurred"
                    }>
                    <input
                      type="text"
                      className="form-control-custom"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength="3"
                      maxLength="30"
                    />
                  </motion.div>
                  <div className="help-text">
                    Must be at least 3 characters long
                  </div>
                </div>

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
                    />
                  </motion.div>
                  <div className="help-text">
                    Must be at least 6 characters long
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="floating-label-group">
                  <label
                    htmlFor="confirmPassword"
                    className={`floating-label ${focusedField === "confirmPassword" || formData.confirmPassword ? "active" : ""}`}>
                    Confirm Password
                  </label>
                  <motion.div
                    variants={inputVariants}
                    animate={
                      focusedField === "confirmPassword" ? "focused" : "blurred"
                    }>
                    <input
                      type="password"
                      className="form-control-custom"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength="6"
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4">
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
                        Creating Account...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </motion.div>

                <div className="text-center mt-4">
                  <p className="mb-0 text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="link-custom">
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
