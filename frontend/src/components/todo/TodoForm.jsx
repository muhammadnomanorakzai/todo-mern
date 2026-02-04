import { useState } from "react";
import DatePicker from "react-datepicker";
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
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="mb-3">
        <label className="form-label fw-semibold">
          <i className="bi bi-card-heading me-1"></i>
          Task Title *
        </label>
        <input
          type="text"
          className="form-control form-control-lg"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">
          <i className="bi bi-text-paragraph me-1"></i>
          Description
        </label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add more details..."
          rows="3"
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">
            <i className="bi bi-flag me-1"></i>
            Priority
          </label>
          <select
            className="form-select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            <i className="bi bi-calendar me-1"></i>
            Due Date
          </label>
          <DatePicker
            selected={formData.dueDate}
            onChange={handleDateChange}
            className="form-control"
            placeholderText="Select a date"
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            isClearable
          />
        </div>
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading || !formData.title.trim()}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Creating...
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>
              Add Task
            </>
          )}
        </button>
      </div>

      <style>{`
        .todo-form input, 
        .todo-form textarea, 
        .todo-form select {
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s;
        }
        
        .todo-form input:focus, 
        .todo-form textarea:focus, 
        .todo-form select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .react-datepicker-wrapper {
          width: 100%;
        }
        
        .react-datepicker__input-container input {
          width: 100%;
        }
      `}</style>
    </form>
  );
};

export default TodoForm;
