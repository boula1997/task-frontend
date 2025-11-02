import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskForm from "../../components/TaskForm";
import { getTaskById, updateTask } from "../../api/tasks";
import type { Task } from "../../api/tasks";

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleUpdate = async (updated: Partial<Task>) => {
    if (!task) return;

    try {
      await updateTask({ ...task, ...updated });
      navigate("/tasks");
    } catch (err: any) {
      // Re-throw so TaskForm can catch it
      throw err;
    }
  };

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
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate("/tasks")}
        >
          ← Back to List
        </button>
      </div>
    );

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary mb-0">
          <i className="bi bi-pencil-square me-2"></i> Edit Task
        </h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/tasks")}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to List
        </button>
      </div>

      {/* Card Wrapper */}
      <div className="card border-0 shadow-lg rounded-4 p-4">
        <p className="text-muted mb-4">
          Update the fields below to edit the task. Changes will be saved immediately.
        </p>

        <TaskForm task={task} onSubmit={handleUpdate} />

        <div className="text-center mt-4">
          <small className="text-secondary">
            <i className="bi bi-info-circle me-1"></i>
            You can always update this task later.
          </small>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
