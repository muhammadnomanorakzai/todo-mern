import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { todoService } from "../../services/todoService";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import TodoFilters from "./TodoFilters";
import TodoStats from "./TodoStats";
import "../../../public/css/TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  });
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoService.getTodos(filters);

      if (response && response.data && Array.isArray(response.data)) {
        setTodos(response.data);
      } else if (response && Array.isArray(response)) {
        setTodos(response);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      const response = await todoService.createTodo(todoData);
      let newTodo = response?.data || response;
      setTodos([newTodo, ...todos]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Failed to create todo",
      };
    }
  };

  const handleUpdateTodo = async (id, updatedData) => {
    try {
      const response = await todoService.updateTodo(id, updatedData);
      let updatedTodo = response?.data || response;
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Failed to update todo",
      };
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Failed to delete todo",
      };
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await todoService.toggleTodo(id);
      let toggledTodo = response?.data || response;
      setTodos(todos.map((todo) => (todo._id === id ? toggledTodo : todo)));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Failed to toggle todo",
      };
    }
  };

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);
  const displayedTodos = showCompleted ? completedTodos : pendingTodos;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="todo-list-container">
      {/* Stats Section */}
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        className="mb-4">
        <TodoStats
          total={todos.length}
          completed={completedTodos.length}
          pending={pendingTodos.length}
        />
      </motion.div>

      <div className="row g-4">
        {/* Left Side - Create Task */}
        <motion.div
          variants={{
            hidden: { x: -20, opacity: 0 },
            visible: { x: 0, opacity: 1 },
          }}
          className="col-lg-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "24px", overflow: "hidden" }}>
            <div
              className="card-header border-0 py-4"
              style={{
                background: "linear-gradient(135deg, #0d6efd)",
              }}>
              <h5 className="mb-0 text-white">
                <i className="bi bi-plus-circle me-2"></i>
                Create New Task
              </h5>
            </div>
            <div className="card-body p-4">
              <TodoForm onSubmit={handleCreateTodo} />
            </div>
          </div>
        </motion.div>

        {/* Right Side - Task List */}
        <motion.div
          variants={{
            hidden: { x: 20, opacity: 0 },
            visible: { x: 0, opacity: 1 },
          }}
          className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "24px", overflow: "hidden" }}>
            <div className="card-header border-0 bg-white py-4">
              <div className="d-flex justify-content-between align-items-center px-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-list-task me-2 text-primary"></i>
                  My Tasks
                </h5>
                <div className="d-flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn ${!showCompleted ? "btn-primary" : "btn-light"} rounded-pill px-4`}
                    onClick={() => setShowCompleted(false)}>
                    Pending ({pendingTodos.length})
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn ${showCompleted ? "btn-primary" : "btn-light"} rounded-pill px-4`}
                    onClick={() => setShowCompleted(true)}>
                    Completed ({completedTodos.length})
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <TodoFilters filters={filters} setFilters={setFilters} />

              {loading ? (
                <div className="text-center py-5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton-loader mb-3"
                      style={{ height: "100px", borderRadius: "20px" }}
                    />
                  ))}
                </div>
              ) : displayedTodos.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-center py-5">
                  <div className="empty-state-icon mb-4">
                    <i className="bi bi-check2-circle display-1 text-muted"></i>
                  </div>
                  <h5 className="text-muted mb-2">
                    {showCompleted
                      ? "No completed tasks yet"
                      : "No pending tasks yet"}
                  </h5>
                  <p className="text-muted mb-4">
                    {showCompleted
                      ? "Complete some tasks to see them here"
                      : "Create your first task to get started"}
                  </p>
                  {!showCompleted && (
                    <button
                      className="btn btn-primary rounded-pill px-4"
                      onClick={() => {
                        document
                          .querySelector(".col-lg-4")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Task
                    </button>
                  )}
                </motion.div>
              ) : (
                <AnimatePresence>
                  <div className="todo-items-list">
                    {displayedTodos.map((todo) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                        onToggle={handleToggleTodo}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TodoList;
