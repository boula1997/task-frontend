import axios from "axios";

// ✅ Base API instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Type definitions
export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date: string;
  priority?: string;
  is_completed: boolean;
  creator_id: number;
  assignee_id: number;
  created_at?: string;
  updated_at?: string;
}

// ✅ Helper: Get Bearer Token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get("/tasks", getAuthHeader());
  return res.data;
};

// ✅ Fetch one task by ID
export const getTaskById = async (id: number): Promise<Task> => {
  const res = await api.get(`/tasks/${id}`, getAuthHeader());
  return res.data;
};

// ✅ Create a new task
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const res = await api.post("/tasks", task, getAuthHeader());
  return res.data;
};

// ✅ Update an existing task
export const updateTask = async (task: Partial<Task>): Promise<Task> => {
  if (!task.id) throw new Error("Task ID is required to update a task");
  const res = await api.post(`/tasks/${task.id}`, task, getAuthHeader());
  return res.data;
};

// ✅ Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`, getAuthHeader());
};
