import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import "./index.css";
import HomePage from "./components/HomePage";
import { useAuthContext } from "./hooks/useAuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Navigate } from "react-router";
import PrivateRoute from "./components/Auth/PrivateRoute";

function App() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <center>Loading...</center>;
  }

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/document/:id"
            element={
              <PrivateRoute>
                <TextEditor />
              </PrivateRoute>
            }
          />

          {/* Login and register */}
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
