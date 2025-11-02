// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: { email: string } | null;
  setUser: (user: { email: string } | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
