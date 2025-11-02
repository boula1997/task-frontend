// src/api/auth.ts
import api from "./api";

export const signup = async (email: string, password: string) => {
  const res = await api.post("/auth/signup.php", { email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login.php", { email, password });
  return res.data; // { token, user }
};
