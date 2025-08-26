import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/users/signup", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Signup successful!");
        navigate("/login");
      } else {
        setErrorMsg(res.data.message || "Signup failed");
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      setErrorMsg("Signup failed");
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4 text-2xl font-bold text-primary">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            {errorMsg && (
              <div className="text-error text-sm text-center mt-2">
                {errorMsg}
              </div>
            )}
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-base-content/70">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="link link-primary text-sm font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
