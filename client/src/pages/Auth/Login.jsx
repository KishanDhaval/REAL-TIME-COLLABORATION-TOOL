import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { toast } from 'react-hot-toast';

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
      // After login, redirect to the previous page (or homepage if none)
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div>
      <div className="register-container flex items-center justify-center flex-col h-[calc(100vh-4rem)] bg-zinc-900 text-white">
        <div className="form border border-gray-600 rounded p-5 w-80 sm:w-96 ">
          <h1 className="text-center text-teal-300 mb-9 mt-2 text-3xl">
            Sign In
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <input
              className="bg-zinc-800 rounded outline-none px-4 py-2 w-full"
              type="email"
              name="email"
              id="email"
              required
              placeholder="email here..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="bg-zinc-800 rounded outline-none px-4 py-2 w-full"
              type="password"
              name="password"
              id="password"
              required
              placeholder="password here..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-teal-500 px-4 py-2 w-full rounded mb-5 ease duration-200 hover:bg-teal-600"
              type="submit"
            >
              Submit
            </button>
          </form>
          <p>
            Still not registered?{" "}
            <Link
              className=" text-teal-300 duration-100 ease hover:text-teal-400"
              to="/register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
