import { useState } from "react";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";

const TodoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    const result = await onSubmit(formData);
    setLoading(false);

    if (result.success) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: null,
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit}
      className="todo-form">
      <div className="mb-4">
        <label className="form-label fw-semibold text-muted small mb-2">
          <i className="bi bi-card-heading me-1"></i>
          Task Title
        </label>
        <input
          type="text"
          className="form-control form-control-lg border-0 bg-light"
          style={{ borderRadius: "16px", padding: "1rem" }}
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Complete project report"
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold text-muted small mb-2">
          <i className="bi bi-text-paragraph me-1"></i>
          Description
        </label>
        <textarea
          className="form-control border-0 bg-light"
          style={{ borderRadius: "16px", padding: "1rem" }}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add more details about this task..."
          rows="4"
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted small mb-2">
            <i className="bi bi-flag me-1"></i>
            Priority
          </label>
          <select
            className="form-select form-select-lg border-0 bg-light"
            style={{ borderRadius: "16px", padding: "0.4rem" }}
            name="priority"
            value={formData.priority}
            onChange={handleChange}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted small mb-2">
            <i className="bi bi-calendar me-1"></i>
            Due Date
          </label>
          <DatePicker
            selected={formData.dueDate}
            onChange={handleDateChange}
            className="form-control form-control-lg border-0 bg-light"
            style={{ borderRadius: "16px", padding: "1rem" }}
            placeholderText="Select due date"
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            isClearable
          />
        </div>
      </div>

      <motion.button
        type="submit"
        className="btn btn-primary btn-lg w-100"
        style={{
          borderRadius: "16px",
          padding: "1rem",
          background: "linear-gradient(135deg, #0d6efd)",
          border: "none",
        }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || !formData.title.trim()}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Creating...
            </motion.span>
          ) : (
            <motion.span
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Task
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
};

export default TodoForm;
