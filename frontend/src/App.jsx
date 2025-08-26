import { Route, Routes } from "react-router";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import HomePage from "./pages/HomePage";
import DayDetail from "./pages/DayDetail";

const App = () => {
  return (
    <div data-theme="forest">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/day/:id" element={<DayDetail />} />
      </Routes>
    </div>
  );
};

export default App;
