// Dashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import TodoList from "../components/todo/TodoList";
import ToastNotification from "../components/shared/ToastNotification";
import StatCard from "../components/todo/TodoStats";
import "../../public/css/Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todos");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to fetch users",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Calculate stats from users or set defaults
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const newUsers = users.filter((u) => {
    const daysSinceJoined =
      (new Date() - new Date(u.createdAt)) / (1000 * 60 * 60 * 24);
    return daysSinceJoined <= 7;
  }).length;

  return (
    <div className="dashboard-wrapper bg-light min-vh-100">
      <motion.main
        className="container-fluid px-4 py-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-5">
          <div className="row align-items-center mb-4">
            <div className="col-md-8">
              <h1 className="display-6 fw-bold mb-2">
                Welcome back, {currentUser?.username || "User"}!
                <span className="hand-wave">👋</span>
              </h1>
              <p className="text-muted mb-0">
                Here's what's happening with your tasks today.
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary rounded-pill px-3 py-2 shadow-sm"
                onClick={() => setActiveTab("todos")}>
                <i className="bi bi-plus-circle me-2"></i>
                Create New Task
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <StatCard
                total={totalUsers || 24}
                completed={activeUsers || 16}
                pending={newUsers || 8}
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="dashboard-tabs">
            <div className="nav nav-pills nav-fill p-1 bg-white rounded-4 shadow-sm">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`nav-link rounded-3 py-3 ${
                  activeTab === "todos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("todos")}>
                <i className="bi bi-check-circle me-2"></i>
                My Tasks
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`nav-link rounded-3 py-3 ${
                  activeTab === "users" ? "active" : ""
                }`}
                onClick={() => setActiveTab("users")}>
                <i className="bi bi-people me-2"></i>
                Team Members
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content-wrapper">
            {activeTab === "todos" ? (
              <TodoList />
            ) : (
              <div className="users-section">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                  <div className="card-header bg-white border-0 py-4 px-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="mb-0 fw-bold">
                        <i className="bi bi-people-fill me-2 text-primary"></i>
                        Team Members
                        <span className="badge bg-primary bg-opacity-10 text-primary ms-3 px-3 py-2">
                          {users.length} Total
                        </span>
                      </h4>
                      <motion.button
                        whileHover={{ rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={fetchUsers}
                        className="btn btn-outline-primary rounded-circle"
                        style={{ width: "48px", height: "48px" }}
                        disabled={loading}>
                        <i className="bi bi-arrow-clockwise fs-5"></i>
                      </motion.button>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {loading ? (
                      <div className="text-center py-5">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="skeleton-loader mb-3"
                            style={{ height: "80px", borderRadius: "16px" }}
                          />
                        ))}
                      </div>
                    ) : users.length === 0 ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center py-5">
                        <div className="empty-state-icon mb-4 mx-auto">
                          <i className="bi bi-people display-1 text-muted"></i>
                        </div>
                        <h5 className="text-muted mb-2">No team members yet</h5>
                        <p className="text-muted mb-4">
                          Invite team members to collaborate on tasks
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-primary rounded-pill px-5 py-3">
                          <i className="bi bi-envelope-plus me-2"></i>
                          Invite Members
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="table-responsive">
                        <table className="table table-hover align-middle">
                          <thead class="bg-primary">
                            <tr>
                              <th className="border-0 rounded-start py-3">
                                User
                              </th>
                              <th className="border-0 py-3">Email</th>
                              <th className="border-0 py-3">Joined</th>
                              <th className="border-0 rounded-end py-3">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user, index) => (
                              <motion.tr
                                key={user._id}
                                variants={itemVariants}
                                whileHover={{
                                  scale: 1.01,
                                  backgroundColor: "#f8f9fa",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                }}
                                className="user-row"
                                style={{ cursor: "pointer" }}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      className={`avatar-circle me-3 ${
                                        user._id === currentUser?._id
                                          ? "bg-primary text-white"
                                          : "bg-soft-primary"
                                      }`}>
                                      {user?.username
                                        ?.charAt(0)
                                        .toUpperCase() || "U"}
                                    </motion.div>
                                    <div>
                                      <strong className="fs-6">
                                        {user.username}
                                      </strong>
                                      {user._id === currentUser?._id && (
                                        <span className="badge bg-primary ms-2 px-3 py-2">
                                          You
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <a
                                    href={`mailto:${user.email}`}
                                    className="text-decoration-none text-primary">
                                    {user.email}
                                    <i className="bi bi-box-arrow-up-right ms-2 small"></i>
                                  </a>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-calendar3 me-2 text-muted"></i>
                                    <span className="text-secondary">
                                      {formatDate(user.createdAt)}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-success bg-opacity-10 text-success px-4 py-3 rounded-pill">
                                    <i className="bi bi-check-circle-fill me-2 small"></i>
                                    Active
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    )}
                  </div>

                  {users.length > 0 && (
                    <div className="card-footer bg-white border-0 py-4 px-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted">
                          Showing <strong>{users.length}</strong> team members
                        </div>
                        <div className="text-muted">
                          <i className="bi bi-clock-history me-2"></i>
                          Last updated: {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {toast.show && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </motion.main>
    </div>
  );
};

export default Dashboard;
