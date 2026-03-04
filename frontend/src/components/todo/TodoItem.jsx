import { useState } from "react";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";

const TodoItem = ({ todo, onUpdate, onDelete, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
  });
  const [loading, setLoading] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return { bg: "rgba(220, 53, 69, 0.1)", color: "#dc3545", dot: "🔴" };
      case "medium":
        return { bg: "rgba(255, 193, 7, 0.1)", color: "#ffc107", dot: "🟡" };
      case "low":
        return { bg: "rgba(25, 135, 84, 0.1)", color: "#198754", dot: "🟢" };
      default:
        return { bg: "#f8f9fa", color: "#6c757d", dot: "⚪" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleToggle = async () => {
    setLoading(true);
    await onToggle(todo._id);
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    const result = await onUpdate(todo._id, editData);
    setLoading(false);

    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setLoading(true);
      await onDelete(todo._id);
      setLoading(false);
    }
  };

  const priority = getPriorityColor(todo.priority);

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card border-0 shadow-sm mb-3"
        style={{ borderRadius: "20px", overflow: "hidden" }}>
        <div className="card-body p-4">
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg border-0 bg-light"
              style={{ borderRadius: "16px" }}
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              placeholder="Task title"
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control border-0 bg-light"
              style={{ borderRadius: "16px" }}
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              placeholder="Description"
              rows="2"
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <select
                className="form-select border-0 bg-light"
                style={{ borderRadius: "16px" }}
                value={editData.priority}
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div className="col-md-6">
              <DatePicker
                selected={editData.dueDate}
                onChange={(date) => setEditData({ ...editData, dueDate: date })}
                className="form-control border-0 bg-light"
                style={{ borderRadius: "16px" }}
                placeholderText="Due date"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                isClearable
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-light rounded-pill px-4"
              onClick={() => setIsEditing(false)}
              disabled={loading}>
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary rounded-pill px-4"
              onClick={handleSaveEdit}
              disabled={loading || !editData.title.trim()}>
              {loading ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card border-0 shadow-sm mb-3"
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        borderLeft: `4px solid ${priority.color}`,
        cursor: "pointer",
      }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`btn ${todo.completed ? "btn-success" : "btn-light"} rounded-circle`}
            style={{ width: "40px", height: "40px", padding: 0 }}
            onClick={handleToggle}
            disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : todo.completed ? (
              <i className="bi bi-check-lg"></i>
            ) : null}
          </motion.button>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <h5
                className={`mb-0 me-2 ${
                  todo.completed
                    ? "text-decoration-line-through text-muted"
                    : ""
                }`}>
                {todo.title}
              </h5>
              <span
                className="badge px-3 py-2"
                style={{
                  background: priority.bg,
                  color: priority.color,
                  borderRadius: "30px",
                }}>
                {priority.dot} {todo.priority}
              </span>
            </div>

            {todo.description && (
              <p className="text-muted mb-3">{todo.description}</p>
            )}

            <div className="d-flex align-items-center gap-3 text-muted small">
              {todo.dueDate && (
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-1"></i>
                  <span
                    className={isOverdue(todo.dueDate) ? "text-danger" : ""}>
                    {formatDate(todo.dueDate)}
                    {isOverdue(todo.dueDate) && " (Overdue)"}
                  </span>
                </div>
              )}
              <div className="d-flex align-items-center">
                <i className="bi bi-clock me-1"></i>
                <span>Created {formatDate(todo.createdAt)}</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="d-flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-light rounded-circle"
                  style={{ width: "36px", height: "36px", padding: 0 }}
                  onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil"></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-light rounded-circle"
                  style={{ width: "36px", height: "36px", padding: 0 }}
                  onClick={handleDelete}>
                  <i className="bi bi-trash text-danger"></i>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;
