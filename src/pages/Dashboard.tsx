// src/pages/Dashboard.tsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { Task } from "../api/tasks"; // type-only
import { getTasks, deleteTask, updateTask, createTask } from "../api/tasks"; // runtime
import TaskCard from "../components/TaskCard";
import TaskForm from "./TaskForm";

const Dashboard: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { token } = useContext(AuthContext);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const fetchTasks = async () => {
        if (!user || !token) return;
        try {
            setLoading(true);
            const data = await getTasks(token); // pass token
            const myTasks = data;
            setTasks(myTasks);

        console.log(myTasks);

        } catch {
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
        } catch {
            setError("Failed to delete task");
        }
    };

    const handleToggleComplete = async (task: Task) => {
        try {
            await updateTask({ ...task, is_completed: !task.is_completed });
            fetchTasks();
        } catch {
            setError("Failed to update task");
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
    };

    const handleFormSubmit = async (task: Partial<Task>) => {
        try {
            if (editingTask) {
                await updateTask({ ...editingTask, ...task });
                setEditingTask(null);
            } else {
                await createTask({
                    ...task,
                    creator_id: user!.id,
                    assignee_id: user!.id,
                    is_completed: false,
                });
            }
            fetchTasks();
        } catch {
            setError("Failed to save task");
        }
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4">Welcome, {user?.email}</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-4">
                <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
                <TaskForm
                    task={editingTask}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setEditingTask(null)}
                />
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p>No tasks assigned to you.</p>
            ) : (
                <div className="row">
                    {tasks.map((task) => (
                        <div key={task.id} className="col-md-6 mb-3">
                            <TaskCard
                                task={task}
                                onDelete={handleDelete}
                                onToggleComplete={handleToggleComplete}
                                onEdit={handleEdit} // pass edit handler
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
