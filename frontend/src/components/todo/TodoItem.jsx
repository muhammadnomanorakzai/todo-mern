import { useState } from "react";
import DatePicker from "react-datepicker";

const TodoItem = ({ todo, onUpdate, onDelete, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
  });
  const [loading, setLoading] = useState(false);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  if (isEditing) {
    return (
      <div className="card mb-3 border-primary">
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              placeholder="Task title"
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              placeholder="Description"
              rows="2"
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <select
                className="form-select"
                value={editData.priority}
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-md-6">
              <DatePicker
                selected={editData.dueDate}
                onChange={(date) => setEditData({ ...editData, dueDate: date })}
                className="form-control"
                placeholderText="Due date"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                isClearable
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setIsEditing(false)}
              disabled={loading}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveEdit}
              disabled={loading || !editData.title.trim()}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`todo-item card mb-3 border-start-5 border-start-${getPriorityBadge(todo.priority)}`}>
      <div className="card-body">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <button
                className={`btn btn-sm ${todo.completed ? "btn-success" : "btn-outline-secondary"} me-3`}
                onClick={handleToggle}
                disabled={loading}
                style={{ width: "32px", height: "32px" }}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : todo.completed ? (
                  <i className="bi bi-check"></i>
                ) : null}
              </button>

              <div className="flex-grow-1">
                <h5
                  className={`mb-1 ${todo.completed ? "text-decoration-line-through text-muted" : ""}`}>
                  {todo.title}
                  <span
                    className={`badge bg-${getPriorityBadge(todo.priority)} ms-2`}>
                    {todo.priority}
                  </span>
                </h5>

                {todo.description && (
                  <p className="text-muted mb-2">{todo.description}</p>
                )}

                <div className="d-flex align-items-center text-muted small">
                  <i className="bi bi-calendar me-1"></i>
                  <span className="me-3">{formatDate(todo.dueDate)}</span>
                  <i className="bi bi-clock me-1"></i>
                  <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setIsEditing(true)}
              title="Edit">
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
              title="Delete">
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
