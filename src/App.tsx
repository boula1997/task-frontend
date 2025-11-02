import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskList from "./pages/tasks/List";
import CreateTask from "./pages/tasks/Create";
import EditTask from "./pages/tasks/Edit";
import ShowTask from "./pages/tasks/Show";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/tasks/:id/edit" element={<EditTask />} />
        <Route path="/tasks/:id" element={<ShowTask />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
