import React, { useEffect, useReducer, useContext, useState } from "react";
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

  // Main function to fetch tasks with current filters and page
  const fetchTasksWithFilters = async (pageNumber = 1) => {
    if (!user) return;
    dispatch({ type: "FETCH_START" });
    try {
      // Convert filters to match API expectations
      const apiFilters = {
        title: state.filters.title,
        description: state.filters.description,
        priority: state.filters.priority,
        status: state.filters.status === 'completed' ? '1' : state.filters.status === 'incomplete' ? '0' : '',
        due_date_from: state.filters.dueFrom,
        due_date_to: state.filters.dueTo,
      };

      const response = await getTasks(apiFilters, pageNumber);
      dispatch({ type: "FETCH_SUCCESS", payload: response });
    } catch (err) {
      console.error(err);
      dispatch({ type: "FETCH_ERROR", payload: "Failed to load tasks." });
    }
  };

  // Initial load
  useEffect(() => {
    fetchTasksWithFilters(1);
  }, []);

  const handleDelete = async (task: Task) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task.id);
      // Refresh the current page after deletion
      fetchTasksWithFilters(state.tasks?.current_page || 1);
    } catch {
      dispatch({ type: "FETCH_ERROR", payload: "Failed to delete task." });
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, is_completed: !task.is_completed };
      await updateTask(updatedTask);
      // Refresh the current page after update
      fetchTasksWithFilters(state.tasks?.current_page || 1);
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

  // Apply filters and reset to page 1
  const applyFilters = () => {
    fetchTasksWithFilters(1);
  };

  // Reset filters and refresh data
  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
    // Wait for state update then refresh data
    // setTimeout(() => fetchTasksWithFilters(1), 0);
  };

  const { loading, error } = state;

  // Use the tasks from the API response
  const tasks = state.tasks?.data || [];
  const pagination = state.tasks || {
    current_page: 1,
    last_page: 1,
    total: 0
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
          <div className="d-flex align-items-center">
            {user && (
              <span className="me-3 fw-semibold text-light">
                <i className="bi bi-person-circle me-1"></i>
                {user.email}
              </span>
            )}
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


        <div className="card-body bg-light rounded-4 mb-3 p-3 shadow-sm">
          <h5 className="mb-3 fw-semibold text-primary">
            <i className="bi bi-funnel me-2"></i>Filter Tasks
          </h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-2">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={state.filters.title}
                onChange={(e) =>
                  dispatch({ type: "SET_FILTER", payload: { field: "title", value: e.target.value } })
                }
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={state.filters.description}
                onChange={(e) =>
                  dispatch({ type: "SET_FILTER", payload: { field: "description", value: e.target.value } })
                }
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Priority</label>
              <select
                className="form-select"
                value={state.filters.priority}
                onChange={(e) =>
                  dispatch({ type: "SET_FILTER", payload: { field: "priority", value: e.target.value } })
                }
              >
                <option value="">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                value={state.filters.status}
                onChange={(e) =>
                  dispatch({ type: "SET_FILTER", payload: { field: "status", value: e.target.value } })
                }
              >
                <option value="">All status</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Due From</label>
              <input
                type="date"
                className="form-control"
                value={state.filters.dueFrom}
                max={state.filters.dueTo || undefined} // can't pick after Due To
                onChange={(e) => {
                  const newDueFrom = e.target.value;
                  // Ensure dueFrom <= dueTo
                  if (state.filters.dueTo && newDueFrom > state.filters.dueTo) {
                    dispatch({ type: "SET_FILTER", payload: { field: "dueFrom", value: state.filters.dueTo } });
                  } else {
                    dispatch({ type: "SET_FILTER", payload: { field: "dueFrom", value: newDueFrom } });
                  }
                }}
              />
            </div>


            <div className="col-md-2">
              <label className="form-label fw-semibold">Due To</label>
              <input
                type="date"
                className="form-control"
                value={state.filters.dueTo}
                min={state.filters.dueFrom || undefined} // can't pick before Due From
                onChange={(e) => {
                  const newDueTo = e.target.value;
                  // Ensure dueTo >= dueFrom
                  if (state.filters.dueFrom && newDueTo < state.filters.dueFrom) {
                    dispatch({ type: "SET_FILTER", payload: { field: "dueTo", value: state.filters.dueFrom } });
                  } else {
                    dispatch({ type: "SET_FILTER", payload: { field: "dueTo", value: newDueTo } });
                  }
                }}
              />
            </div>


            <div className="col-md-12 d-flex justify-content-center mt-2">
              <button
                className="btn btn-primary me-2"
                onClick={applyFilters}
              >
                <i className="bi bi-funnel me-1"></i> Filter
              </button>
              <button
                className="btn btn-secondary"
                onClick={resetFilters}
              >
                <i className="bi bi-x-circle me-1"></i> Reset
              </button>
            </div>
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
                <thead className="table-primary">
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
                              className={`btn btn-sm ${task.is_completed
                                ? "btn-outline-secondary"
                                : "btn-outline-success"
                                }`}
                              onClick={() => handleToggleComplete(task)}
                            >
                              <i
                                className={`bi ${task.is_completed
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

              {/* Pagination Controls */}
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-outline-primary me-2"
                  disabled={pagination.current_page === 1}
                  onClick={() => fetchTasksWithFilters(pagination.current_page - 1)}
                >
                  Previous
                </button>
                <span className="align-self-center mx-3">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  className="btn btn-outline-primary ms-2"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => fetchTasksWithFilters(pagination.current_page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;