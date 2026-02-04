const TodoStats = ({ total, completed, pending }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="todo-stats">
      <h6 className="fw-bold mb-3">
        <i className="bi bi-bar-chart me-2"></i>
        Task Statistics
      </h6>

      <div className="row text-center">
        <div className="col-4">
          <div className="stat-box">
            <div className="display-6 fw-bold text-primary">{total}</div>
            <div className="text-muted small">Total</div>
          </div>
        </div>

        <div className="col-4">
          <div className="stat-box">
            <div className="display-6 fw-bold text-success">{completed}</div>
            <div className="text-muted small">Completed</div>
          </div>
        </div>

        <div className="col-4">
          <div className="stat-box">
            <div className="display-6 fw-bold text-warning">{pending}</div>
            <div className="text-muted small">Pending</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted small">Completion Rate</span>
          <span className="text-muted small">{completionRate}%</span>
        </div>
        <div className="progress" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${completionRate}%` }}
            role="progressbar"></div>
        </div>
      </div>

      <style>{`
        .stat-box {
          padding: 10px;
          border-radius: 10px;
          background: #f8f9fa;
          transition: transform 0.3s;
        }
        
        .stat-box:hover {
          transform: translateY(-5px);
          background: #e9ecef;
        }
      `}</style>
    </div>
  );
};

export default TodoStats;
