import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/users/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        setErrorMsg(res.data.message || "Login failed");
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      setErrorMsg("Incorrect email or password");
      toast.error("Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4 text-2xl font-bold text-primary">
            Login
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
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {errorMsg && (
              <div className="text-error text-sm text-center mt-2">
                {errorMsg}
              </div>
            )}
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-base-content/70">
              No account yet?{" "}
            </span>
            <a
              href="/signup"
              className="link link-primary text-sm font-semibold"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
