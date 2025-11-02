// src/pages/TaskForm.tsx
import React, { useState, useEffect } from "react";
import type { Task } from "../api/tasks"; // ✅ type-only import

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Partial<Task>) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.due_date?.slice(0, 10) || ""); // YYYY-MM-DD
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
    // Clear form if creating new task
    if (!task) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setAssigneeEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
      <div className="mb-2">
        <label className="block">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block">Due Date *</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Assign to (email)</label>
        <input
          type="email"
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {task ? "Update Task" : "Create Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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
