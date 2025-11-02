import React, { useState, useEffect } from "react";
import type { Task } from "../api/tasks"; // type-only import

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Partial<Task>) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.due_date?.slice(0, 10) || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.due_date?.slice(0, 10) || "");
      setPriority(task.priority || "medium");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert("Title and Due Date are required");
      return;
    }
    onSubmit({
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
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
      <h5 className="card-title mb-3">{task ? "Edit Task" : "Create New Task"}</h5>

      <div className="mb-3">
        <label className="form-label">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Due Date *</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="form-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Assign to (email)</label>
        <input
          type="email"
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
          className="form-control"
        />
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
