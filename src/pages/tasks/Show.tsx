import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById } from "../../api/tasks";
import type { Task } from "../../api/tasks";

const ShowTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(Number(id));
        setTask(data);
      } catch (err) {
        console.error("Failed to load task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading task details...</p>
      </div>
    );

  if (!task)
    return (
      <div className="text-center py-5">
        <h5 className="text-danger">Task not found</h5>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate("/tasks")}>
          ← Back to list
        </button>
      </div>
    );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary mb-0">
          <i className="bi bi-clipboard2-check me-2"></i> Task Details
        </h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/tasks")}>
          <i className="bi bi-arrow-left me-1"></i> Back to List
        </button>
      </div>

      <div className="card border-0 shadow-lg rounded-4 p-4">
        <div className="mb-4">
          <h3 className="fw-bold text-dark mb-1">{task.title}</h3>
          <p className="text-muted mb-0">{task.description || "No description provided."}</p>
        </div>

        <div className="row gy-3">
          <div className="col-md-4">
            <div className="bg-light p-3 rounded">
              <strong>📅 Due Date:</strong>
              <div>{new Date(task.due_date).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="bg-light p-3 rounded">
              <strong>⚡ Priority:</strong>
              <div>
                <span
                  className={`badge ${task.priority === "high"
                      ? "bg-danger"
                      : task.priority === "medium"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="bg-light p-3 rounded">
              <strong>✅ Status:</strong>
              <div>
                <span
                  className={`badge ${task.is_completed ? "bg-success" : "bg-secondary"
                    }`}
                >
                  {task.is_completed ? "Completed" : "Incomplete"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-end">
          <button
            className="btn btn-primary px-4"
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
          >
            <i className="bi bi-pencil-square me-1"></i> Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowTask;
