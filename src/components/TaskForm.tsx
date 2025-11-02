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

  // Focus the first field with error automatically
  useEffect(() => {
    const firstFieldWithError = Object.keys(errors)[0];
    if (firstFieldWithError) {
      const el = document.getElementById(firstFieldWithError);
      el?.focus();
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Frontend validation for assignee_email only on create
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

      if (!task) {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("medium");
        setAssigneeEmail("");
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.message || "Something went wrong");
      }
    }
  };


  const renderError = (field: string) =>
    errors[field]?.map((msg, i) => (
      <div key={i} className="text-danger small">
        {msg}
      </div>
    ));

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <div className="mb-3">
        <label className="form-label" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {renderError("title")}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {renderError("description")}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="due_date">
          Due Date *
        </label>
        <input
          id="due_date"
          type="date"
          className={`form-control ${errors.due_date ? "is-invalid" : ""}`}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        {renderError("due_date")}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          className={`form-select ${errors.priority ? "is-invalid" : ""}`}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Select</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {renderError("priority")}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="assignee_email">
          Assign to (email){!task && " *"}
        </label>
        <input
          id="assignee_email"
          type="email"
          className={`form-control ${errors.assignee_email ? "is-invalid" : ""}`}
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
          placeholder="Assignee Email"
        />
        {renderError("assignee_email")}
      </div>


      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {task ? "Update Task" : "Create Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
