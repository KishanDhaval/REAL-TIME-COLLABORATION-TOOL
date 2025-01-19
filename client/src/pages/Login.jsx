import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { toast } from "react-hot-toast";
import "./auth.css";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the route the user came from, or default to "/"
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="form">
        <h1 className="title">Sign In</h1>
        <form onSubmit={handleSubmit} className="form-fields">
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email here..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            name="password"
            id="password"
            required
            placeholder="Password here..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
        <p>
          Still not registered?{" "}
          <Link className="link" to="/register">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
