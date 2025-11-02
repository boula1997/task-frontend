import React from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../../components/TaskForm";
import { createTask } from "../../api/tasks";
import { AuthContext } from "../../context/AuthContext";

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);

  const handleCreate = async (task: any) => {
    await createTask({
      ...task,
      creator_id: user!.id,
      assignee_id: user!.id,
      is_completed: false,
    });
    navigate("/tasks");
  };

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary mb-0">
          <i className="bi bi-plus-circle me-2"></i> Create New Task
        </h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/tasks")}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to List
        </button>
      </div>

      {/* Card Wrapper */}
      <div className="card border-0 shadow-lg rounded-4 p-4">
        <p className="text-muted mb-4">
          Fill out the form below to add a new task to your project.
        </p>

        <TaskForm onSubmit={handleCreate} />

        <div className="text-center mt-4">
          <small className="text-secondary">
            <i className="bi bi-info-circle me-1"></i>
            You can edit this task later from the task details page.
          </small>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
