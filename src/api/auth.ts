// src/api/auth.ts
import api from "./api";

export const signup = async (email: string, password: string) => {
  const res = await api.post("/auth/signup", { email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { token, user }
};



export const logout = async (token: string) => {
  const res = await api.post( "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

