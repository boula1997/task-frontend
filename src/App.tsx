import { Routes, Route } from "react-router-dom";
import TaskList from "./pages/tasks/list";
import CreateTask from "./pages/tasks/create";
import EditTask from "./pages/tasks/edit";
import ShowTask from "./pages/tasks/show";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />


      {/* Protected routes */}
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TaskList />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <PrivateRoute>
            <CreateTask />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:id/edit"
        element={
          <PrivateRoute>
            <EditTask />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute>
            <ShowTask />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
