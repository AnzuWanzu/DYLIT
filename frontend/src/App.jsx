import { Route, Routes, Navigate } from "react-router";
import { useState, useEffect } from "react";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import HomePage from "./pages/HomePage";
import DayDetail from "./pages/DayDetail";
import CreateDayPage from "./pages/CreateDayPage";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("User is authenticated");
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div
        data-theme="forest"
        className="min-h-screen flex items-center justify-center"
      >
        <div className="loading loading-spinner loading-lg text-accent"></div>
      </div>
    );
  }
  return (
    <div data-theme="forest">
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginForm />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignupForm />
            </AuthRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/day/:id"
          element={
            <ProtectedRoute>
              <DayDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateDayPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
