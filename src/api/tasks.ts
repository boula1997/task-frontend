import axios from "axios";

export interface Task {
  id: number;
  creator_id: number;
  assignee_id: number;
  title: string;
  description?: string;
  due_date: string; // YYYY-MM-DD
  priority?: "low" | "medium" | "high";
  is_completed: boolean;
  assignee_email?: string;
}

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get("/tasks");
  return res.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const res = await api.post("/tasks", task);
  return res.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const res = await api.put(`/tasks/${task.id}`, task);
  return res.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
