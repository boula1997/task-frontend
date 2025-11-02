import React, { useState, useEffect } from "react";
import type { Task } from "../api/tasks";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Partial<Task>) => Promise<void>;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.due_date?.slice(0, 10) || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.due_date?.slice(0, 10) || "");
      setPriority(task.priority || "medium");
    }
  }, [task]);

  useEffect(() => {
    const firstFieldWithError = Object.keys(errors)[0];
    if (firstFieldWithError) {
      document.getElementById(firstFieldWithError)?.focus();
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!task && !assigneeEmail) {
      setErrors({ assignee_email: ["Assignee email is required for new tasks"] });
      return;
    }

    try {
      await onSubmit({
        title,
        description,
        due_date: dueDate,
        priority,
        assignee_email: assigneeEmail || undefined,
      });
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else if (errorData?.message) {
        alert(errorData.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const renderError = (field: string) =>
    errors[field]?.map((msg, i) => (
      <div key={i} className="text-danger small mt-1">
        <i className="bi bi-exclamation-circle me-1"></i>
        {msg}
      </div>
    ));

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
            <i className="bi bi-pencil-square me-2"></i>
            {task ? "Edit Task" : "Create New Task"}
          </h4>
        </div>

        <div className="card-body bg-light rounded-bottom-4 p-4">
          <form onSubmit={handleSubmit} className="needs-validation">
            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="title">
                <i className="bi bi-type me-2 text-primary"></i>Title
                <span className="text-danger ms-1">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
              />
              {renderError("title")}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="description">
                <i className="bi bi-card-text me-2 text-primary"></i>Description
              </label>
              <textarea
                id="description"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                rows={3}
                placeholder="Enter task description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {renderError("description")}
            </div>

            {/* Due Date */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="due_date">
                <i className="bi bi-calendar-event me-2 text-primary"></i>Due Date
                <span className="text-danger ms-1">*</span>
              </label>
              <input
                id="due_date"
                type="date"
                className={`form-control ${errors.due_date ? "is-invalid" : ""}`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {renderError("due_date")}
            </div>

            {/* Priority */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="priority">
                <i className="bi bi-flag me-2 text-primary"></i>Priority
              </label>
              <select
                id="priority"
                className={`form-select ${errors.priority ? "is-invalid" : ""}`}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {renderError("priority")}
            </div>

            {/* Assignee Email */}
            <div className="mb-4">
              <label
                className="form-label fw-semibold"
                htmlFor="assignee_email"
              >
                <i className="bi bi-person-plus me-2 text-primary"></i>Assign to
                (email)
                {!task && <span className="text-danger ms-1">*</span>}
              </label>
              <input
                id="assignee_email"
                type="email"
                className={`form-control ${
                  errors.assignee_email ? "is-invalid" : ""
                }`}
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
                placeholder="Enter email to assign task"
              />
              {renderError("assignee_email")}
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2">
              {onCancel && (
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={onCancel}
                >
                  <i className="bi bi-x-circle me-1"></i>Cancel
                </button>
              )}
              <button type="submit" className="btn btn-primary px-4">
                <i
                  className={`bi ${
                    task ? "bi-arrow-repeat" : "bi-plus-circle"
                  } me-1`}
                ></i>
                {task ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
