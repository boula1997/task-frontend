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

  if (loading) return <p>Loading...</p>;
  if (!task) return <p>Task not found</p>;

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/tasks")}>
        ← Back to list
      </button>

      <div className="card p-4 shadow-sm">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p><strong>Due Date:</strong> {task.due_date}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p>
          <strong>Status:</strong>{" "}
          {task.is_completed ? "Completed" : "Incomplete"}
        </p>
      </div>
    </div>
  );
};

export default ShowTask;
