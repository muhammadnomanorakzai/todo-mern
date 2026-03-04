import api from "./api";

export const todoService = {
  getTodos: async (filters = {}) => {
    try {
      // Create a params object that only includes non-"all" values
      const params = {};

      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }

      if (filters.priority && filters.priority !== "all") {
        params.priority = filters.priority;
      }

      // Convert params to URLSearchParams
      const queryParams = new URLSearchParams(params).toString();
      const url = `/todos${queryParams ? `?${queryParams}` : ""}`;

      console.log("Fetching todos with URL:", url); // Debug log
      const response = await api.get(url);
      console.log("Todo response:", response.data); // Debug log

      return response.data;
    } catch (error) {
      console.error("Error in getTodos:", error);
      throw error;
    }
  },

  createTodo: async (todoData) => {
    try {
      const response = await api.post("/todos", todoData);
      return response.data;
    } catch (error) {
      console.error("Error in createTodo:", error);
      throw error;
    }
  },

  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error("Error in updateTodo:", error);
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in deleteTodo:", error);
      throw error;
    }
  },

  toggleTodo: async (id) => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error("Error in toggleTodo:", error);
      throw error;
    }
  },
};
