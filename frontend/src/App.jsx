import { Route, Routes } from "react-router";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div data-theme="forest">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
