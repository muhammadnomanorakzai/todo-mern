import { motion } from "framer-motion";

const TodoStats = ({ total, completed, pending }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (custom) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="todo-stats bg-white p-4 rounded-4 shadow-sm">
      <h6 className="fw-bold mb-4">
        <i className="bi bi-bar-chart me-2 text-primary"></i>
        Task Overview
      </h6>

      <div className="row g-4">
        <motion.div custom={0} variants={statVariants} className="col-4">
          <div
            className="stat-card text-center p-3 rounded-4"
            style={{ background: "rgba(13, 110, 253, 0.05)" }}>
            <div className="display-6 fw-bold text-primary mb-1">{total}</div>
            <div className="text-muted small">Total Tasks</div>
          </div>
        </motion.div>

        <motion.div custom={1} variants={statVariants} className="col-4">
          <div
            className="stat-card text-center p-3 rounded-4"
            style={{ background: "rgba(25, 135, 84, 0.05)" }}>
            <div className="display-6 fw-bold text-success mb-1">
              {completed}
            </div>
            <div className="text-muted small">Completed</div>
          </div>
        </motion.div>

        <motion.div custom={2} variants={statVariants} className="col-4">
          <div
            className="stat-card text-center p-3 rounded-4"
            style={{ background: "rgba(255, 193, 7, 0.05)" }}>
            <div className="display-6 fw-bold text-warning mb-1">{pending}</div>
            <div className="text-muted small">Pending</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted small">Completion Rate</span>
          <span className="fw-semibold">{completionRate}%</span>
        </div>
        <div
          className="progress"
          style={{ height: "10px", borderRadius: "10px" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="progress-bar bg-success"
            style={{ borderRadius: "10px" }}
            role="progressbar"
          />
        </div>
      </motion.div>

      <style>{`
        .stat-card {
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
      `}</style>
    </motion.div>
  );
};

export default TodoStats;
