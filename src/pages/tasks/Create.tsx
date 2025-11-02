import React from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../../components/TaskForm";
import { createTask } from "../../api/tasks";
import { AuthContext } from "../../context/AuthContext";

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);

  const handleCreate = async (task: any) => {
    try {
      await createTask({
        ...task,
        creator_id: user!.id,
        assignee_id: user!.id,
        is_completed: false,
      });
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Error creating task");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Create New Task</h2>
      <TaskForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateTask;
