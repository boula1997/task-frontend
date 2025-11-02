import React from "react";
import type { Task } from "../api/tasks";

interface Props {
  task: Task;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onEdit?: (task: Task) => void; // optional edit handler
}

const TaskCard: React.FC<Props> = ({ task, onDelete, onToggleComplete, onEdit }) => {
  const status = task.is_completed
    ? "Done"
    : new Date(task.due_date).toDateString() === new Date().toDateString()
    ? "Due Today"
    : new Date(task.due_date) < new Date()
    ? "Missed/Late"
    : "Upcoming";

  const badgeClass =
    status === "Done"
      ? "bg-success"
      : status === "Due Today"
      ? "bg-warning text-dark"
      : status === "Missed/Late"
      ? "bg-danger"
      : "bg-info";

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{task.title}</h5>
          <span className={`badge ${badgeClass}`}>{status}</span>
        </div>

        <p className="card-text text-muted" style={{ minHeight: "60px" }}>
          {task.description || "No description provided."}
        </p>

        <p className="text-secondary mb-3">
          <small>Due: {new Date(task.due_date).toLocaleDateString()}</small>
        </p>

        <div className="d-flex justify-content-between">
          <button
            className={`btn btn-sm ${task.is_completed ? "btn-outline-secondary" : "btn-success"}`}
            onClick={() => onToggleComplete(task)}
          >
            {task.is_completed ? "Mark Incomplete" : "Mark Complete"}
          </button>

          {onEdit && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
          )}

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(task)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
