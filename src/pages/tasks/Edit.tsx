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


  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Edit Task</h2>
      {task && <TaskForm task={task} onSubmit={handleUpdate} />}
    </div>
  );
};

export default EditTask;
