import { motion } from "framer-motion";

const TodoFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="todo-filters mb-4 p-3 bg-white rounded-3 shadow-sm">
      <div className="row g-3">
        <div className="col-md-5">
          <label className="form-label fw-semibold text-muted small mb-2">
            <i className="bi bi-flag me-1"></i>
            Status
          </label>
          <select
            className="form-select form-select-lg border-0 bg-light"
            style={{ borderRadius: "12px" }}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-md-5">
          <label className="form-label fw-semibold text-muted small mb-2">
            <i className="bi bi-bar-chart me-1"></i>
            Priority
          </label>
          <select
            className="form-select form-select-lg border-0 bg-light"
            style={{ borderRadius: "12px" }}
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-outline-secondary w-100 py-2"
            style={{ borderRadius: "12px" }}
            onClick={clearFilters}>
            <i className="bi bi-x-circle me-2"></i>
            Clear
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoFilters;
