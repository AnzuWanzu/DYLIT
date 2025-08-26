import { Route, Routes } from "react-router";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const App = () => {
  return (
    <div data-theme="forest">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </div>
  );
};

export default App;
