import React from "react";
import type { Task } from "../api/tasks"; // ✅ type only
import { deleteTask, updateTask } from "../api/tasks"; // ✅ runtime functions

interface Props {
  task: Task;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

const TaskCard: React.FC<Props> = ({ task, onDelete, onToggleComplete }) => {
  const status = task.is_completed
    ? "Done"
    : new Date(task.due_date).toDateString() === new Date().toDateString()
    ? "Due Today"
    : new Date(task.due_date) < new Date()
    ? "Missed/Late"
    : "Upcoming";

  const statusColor =
    status === "Done"
      ? "green"
      : status === "Due Today"
      ? "yellow"
      : status === "Missed/Late"
      ? "red"
      : "blue";

  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <p>Due: {task.due_date}</p>
      <p className={`font-semibold text-${statusColor}-500`}>{status}</p>
      <button onClick={() => onToggleComplete(task)}>Toggle Complete</button>
      <button onClick={() => onDelete(task)}>Delete</button>
    </div>
  );
};

export default TaskCard;
