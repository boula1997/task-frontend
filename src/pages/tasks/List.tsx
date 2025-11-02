import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getTasks, deleteTask, updateTask } from "../../api/tasks";
import { logout } from "../../api/auth"; // import your logout API
import type { Task } from "../../api/tasks";

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

  // ✅ Logout handler
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      if (token) {
        await logout(token); // call backend API
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear auth state and navigate to login
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Tasks</h2>
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/tasks/create")}
          >
            + New Task
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ width: "180px" }}>Actions</th>
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
                    ? "text-success"
                    : status === "Due Today"
                    ? "text-warning"
                    : status === "Late"
                    ? "text-danger"
                    : "text-primary";

                return (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description || "—"}</td>
                    <td>{new Date(task.due_date).toLocaleDateString()}</td>
                    <td className="text-capitalize">{task.priority || "medium"}</td>
                    <td className={statusClass}>{status}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => navigate(`/tasks/${task.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-sm ${
                            task.is_completed ? "btn-secondary" : "btn-success"
                          }`}
                          onClick={() => handleToggleComplete(task)}
                        >
                          {task.is_completed ? "Undo" : "Complete"}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(task)}
                        >
                          Delete
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
  );
};

export default TaskList;
