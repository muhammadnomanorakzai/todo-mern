import { motion } from "framer-motion";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <div
            className="spinner-border text-light"
            role="status"
            style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}>
      <Header />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="container-fluid px-4 py-4">
        <Outlet />
      </motion.div>
    </motion.div>
  );
};

export default Layout;
