import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      if (data.access_token && data.user) {
        setToken(data.access_token);
        setUser(data.user);
        navigate("/tasks");
      } else {
        setError("Invalid login response from server");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #4158D0, #C850C0, #FFCC70)",
        padding: "20px",
      }}
    >
      <div
        className="card border-0 shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#4158D0" }}>
          Welcome Back
        </h3>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-envelope-fill text-primary"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

<div className="mb-3">
  <label className="form-label fw-semibold">Password</label>
  <div className="input-group">
    <span className="input-group-text bg-light">
      <i className="bi bi-lock-fill text-primary"></i>
    </span>

    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      placeholder="Minimum 6 characters"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <span
      className="input-group-text bg-light"
      style={{ cursor: "pointer" }}
      onClick={() => setShowPassword(!showPassword)}
    >
      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
    </span>
  </div>
</div>


          <button
            type="submit"
            className="btn w-100 text-white fw-semibold"
            style={{
              background: "linear-gradient(90deg, #4158D0, #C850C0)",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="fw-semibold text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
