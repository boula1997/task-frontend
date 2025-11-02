// src/pages/Dashboard.tsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { Task, getTasks, deleteTask, updateTask, createTask } from "../api/tasks";
import TaskCard from "../components/TaskCard";
import TaskForm from "./TaskForm";

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks assigned to the logged-in user
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data: Task[] = await getTasks();
      // Filter tasks assigned to the current user
      const myTasks = data.filter((task) => task.assignee_id === user?.id);
      setTasks(myTasks);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (task: Task) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task.id);
      setTasks(tasks.filter((t) => t.id !== task.id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask({ ...task, is_completed: !task.is_completed });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleFormSubmit = async (task: Partial<Task>) => {
    try {
      if (editingTask) {
        // Update existing task
        await updateTask({ ...editingTask, ...task });
        setEditingTask(null);
      } else {
        // Create new task
        await createTask({ ...task, creator_id: user!.id, assignee_id: user!.id, is_completed: false });
      }
      fetchTasks();
    } catch (err) {
      setError("Failed to save task");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{editingTask ? "Edit Task" : "Create New Task"}</h2>
        <TaskForm task={editingTask} onSubmit={handleFormSubmit} onCancel={() => setEditingTask(null)} />
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit} // pass edit handler
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
