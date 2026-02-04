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
    <div className="todo-filters mb-4">
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Status</label>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Priority</label>
          <select
            className="form-select"
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="col-md-4 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={clearFilters}>
            <i className="bi bi-x-circle me-2"></i>
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoFilters;
