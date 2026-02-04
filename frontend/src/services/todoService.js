import api from "./api";

export const todoService = {
  getTodos: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = `/todos${params ? `?${params}` : ""}`;
    const response = await api.get(url);
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await api.post("/todos", todoData);
    return response.data;
  },

  updateTodo: async (id, todoData) => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },

  toggleTodo: async (id) => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },
};
