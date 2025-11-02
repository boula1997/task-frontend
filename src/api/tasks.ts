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

export const getTasks = async (token: string) => {
  const res = await axios.get(`http://localhost:8000/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const token = localStorage.getItem("token"); 

  const res = await api.post("http://localhost:8000/api/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const updateTask = async (task: Task): Promise<Task> => {
  const token = localStorage.getItem("token"); 

  const res = await api.post(`/tasks/${task.id}`, task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  const token = localStorage.getItem("token"); 

  await api.delete(`/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
