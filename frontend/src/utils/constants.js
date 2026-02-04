export const VITE_API_URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:5000/api" // Your backend Vercel URL
    : "http://localhost:5000/api";

export const FILTER_OPTIONS = {
  ALL: "all",
  COMPLETED: "completed",
  PENDING: "pending",
};

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};
