import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import TodoList from "../components/todo/TodoList";
import ToastNotification from "../components/shared/ToastNotification";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todos"); // "todos" or "users"
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { user: currentUser, logout } = useAuth();

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

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header mb-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-5 fw-bold mb-2">
              <i className="bi bi-speedometer2 me-3"></i>
              User Dashboard
            </h1>
            <p className="text-muted">
              Manage your tasks and view registered users in one place
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="dashboard-tabs mt-4">
          <ul className="nav">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "todos" ? "active" : ""}`}
                onClick={() => setActiveTab("todos")}>
                <i className="bi bi-check-circle me-2"></i>
                My Tasks
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}>
                <i className="bi bi-people me-2"></i>
                All Users
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "todos" ? (
        <TodoList />
      ) : (
        <div className="users-section">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-black">
                  <i className="bi bi-people-fill me-2"></i>
                  Registered Users
                </h4>
                <button
                  onClick={fetchUsers}
                  className="btn btn-light btn-sm"
                  disabled={loading}>
                  <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-people display-4 text-muted"></i>
                  </div>
                  <h5 className="text-muted">No users found</h5>
                  <p className="text-muted">
                    Register new users to see them here
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Joined On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user._id} className="user-row">
                          <td className="fw-semibold">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                {user?.username?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div>
                                <strong>{user.username}</strong>
                                {user._id === currentUser?._id && (
                                  <span className="badge bg-info ms-2">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <a
                              href={`mailto:${user.email}`}
                              className="text-decoration-none">
                              {user.email}
                            </a>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {users.length > 0 && (
                <div className="mt-4 d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    Showing <strong>{users.length}</strong> registered users
                  </div>
                  {/* <div className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Click on email to send message
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <style>{`
        .dashboard-container {
          animation: fadeIn 0.5s ease;
        }
        
        .dashboard-header {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .dashboard-tabs .nav-pills .nav-link {
          padding: 1rem 2rem;
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        
        .dashboard-tabs .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .dashboard-tabs .nav-pills .nav-link:not(.active):hover {
          background: #f8f9fa;
          border-color: #dee2e6;
        }
        
        .user-row:hover {
          background-color: #f8f9fa;
          transform: translateX(5px);
          transition: all 0.3s;
        }
        
        .avatar-circle {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
