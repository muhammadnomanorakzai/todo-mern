import { useState, useEffect } from "react";
import { todoService } from "../../services/todoService";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import TodoFilters from "./TodoFilters";
import TodoStats from "./TodoStats";

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
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      const response = await todoService.createTodo(todoData);
      setTodos([response.data, ...todos]);
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
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
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
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
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

  return (
    <>
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <TodoStats
            total={todos.length}
            completed={completedTodos.length}
            pending={pendingTodos.length}
          />
        </div>
      </div>
      <div className="todo-list-container mt-5">
        <div className="row">
          {/* Left Side - Todo Form & Stats */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-gradient-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Task
                </h5>
              </div>
              <div className="card-body">
                <TodoForm onSubmit={handleCreateTodo} />
              </div>
            </div>
          </div>

          {/* Right Side - Todo List */}
          <div className="col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-gradient-info text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-list-task me-2"></i>
                    My Tasks
                  </h5>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${showCompleted ? "btn-light" : "btn-outline-light"}`}
                      onClick={() => setShowCompleted(false)}>
                      Pending ({pendingTodos.length})
                    </button>
                    <button
                      className={`btn btn-sm ${showCompleted ? "btn-outline-light" : "btn-light"}`}
                      onClick={() => setShowCompleted(true)}>
                      Completed ({completedTodos.length})
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <TodoFilters filters={filters} setFilters={setFilters} />

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading tasks...</p>
                  </div>
                ) : displayedTodos.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="bi bi-check2-circle display-4 text-muted"></i>
                    </div>
                    <h5 className="text-muted">
                      {showCompleted
                        ? "No completed tasks yet"
                        : "No pending tasks yet"}
                    </h5>
                    <p className="text-muted">
                      {showCompleted
                        ? "Complete some tasks to see them here"
                        : "Create your first task to get started"}
                    </p>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
        .todo-list-container {
          animation: fadeIn 0.5s ease-in;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .bg-gradient-info {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .todo-items-list {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 10px;
        }
        
        .todo-items-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .todo-items-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .todo-items-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .todo-items-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    </>
  );
};

export default TodoList;
