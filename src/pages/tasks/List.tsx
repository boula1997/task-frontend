import React, { useEffect, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getTasks, deleteTask, updateTask } from "../../api/tasks";
import { logout } from "../../api/auth";
import type { Task } from "../../api/tasks";
import { tasksReducer, initialState } from "./tasksReducer";
import "bootstrap-icons/font/bootstrap-icons.css";

const TaskList: React.FC = () => {
  const { user, token, setUser, setToken } = useContext(AuthContext);
  const [state, dispatch] = useReducer(tasksReducer, initialState);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    if (!user) return;
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getTasks();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      console.error(err);
      dispatch({ type: "FETCH_ERROR", payload: "Failed to load tasks." });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (task: Task) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task.id);
      dispatch({ type: "DELETE_TASK", payload: task.id });
    } catch {
      dispatch({ type: "FETCH_ERROR", payload: "Failed to delete task." });
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, is_completed: !task.is_completed };
      await updateTask(updatedTask);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    } catch {
      dispatch({ type: "FETCH_ERROR", payload: "Failed to update task status." });
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      if (token) await logout(token);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const { tasks, loading, error } = state;

  return (
    <div className="container py-5">
      {/* same JSX as before, just replace state variables */}
    </div>
  );
};

export default TaskList;
