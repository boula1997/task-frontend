import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getTasks, deleteTask, updateTask } from "../../api/tasks";
import { logout } from "../../api/auth";
import type { Task } from "../../api/tasks";
import "bootstrap-icons/font/bootstrap-icons.css";

const TaskList: React.FC = () => {
  const { user, token, setUser, setToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (task: Task) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch {
      setError("Failed to delete the task.");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask({ ...task, is_completed: !task.is_completed });
      fetchTasks();
    } catch {
      setError("Failed to update task status.");
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      if (token) {
        await logout(token);
      }
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

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 rounded-4">
        <div
          className="card-header text-white d-flex justify-content-between align-items-center"
          style={{
            background: "linear-gradient(90deg, #007bff, #6610f2)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          <h4 className="mb-0 fw-semibold">
            <i className="bi bi-list-task me-2"></i>My Tasks
          </h4>
          <div>
            <button
              className="btn btn-light btn-sm fw-semibold me-2"
              onClick={() => navigate("/tasks/create")}
            >
              <i className="bi bi-plus-lg me-1"></i>New Task
            </button>
            <button
              className="btn btn-outline-light btn-sm fw-semibold"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>

        <div className="card-body bg-light rounded-bottom-4 p-4">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-muted">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-center text-muted">No tasks found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle bg-white shadow-sm rounded-3">
                <thead className="table-primary text-center">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th style={{ width: "200px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    const status = task.is_completed
                      ? "Done"
                      : new Date(task.due_date).toDateString() ===
                        new Date().toDateString()
                      ? "Due Today"
                      : new Date(task.due_date) < new Date()
                      ? "Late"
                      : "Upcoming";

                    const statusClass =
                      status === "Done"
                        ? "text-success fw-semibold"
                        : status === "Due Today"
                        ? "text-warning fw-semibold"
                        : status === "Late"
                        ? "text-danger fw-semibold"
                        : "text-primary fw-semibold";

                    return (
                      <tr key={task.id}>
                        <td className="fw-semibold">{task.title}</td>
                        <td>{task.description || "—"}</td>
                        <td>{new Date(task.due_date).toLocaleDateString()}</td>
                        <td className="text-capitalize">
                          {task.priority || "medium"}
                        </td>
                        <td className={statusClass}>{status}</td>
                        <td>
                          <div className="d-flex justify-content-center flex-wrap gap-2">
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => navigate(`/tasks/${task.id}`)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => navigate(`/tasks/${task.id}/edit`)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className={`btn btn-sm ${
                                task.is_completed
                                  ? "btn-outline-secondary"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleToggleComplete(task)}
                            >
                              <i
                                className={`bi ${
                                  task.is_completed
                                    ? "bi-arrow-counterclockwise"
                                    : "bi-check2-circle"
                                }`}
                              ></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(task)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
