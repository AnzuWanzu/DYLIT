import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, LogOutIcon } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header
      className="bg-base-300 border-b border-base-content/10"
      style={{ backgroundColor: "#191919" }}
    >
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold font-serif tracking-tight text-primary">
            DYLIT{" "}
            <span className="text-base-content/70 text-lg font-normal ml-2">
              (Did you lock in today?)
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-active btn-accent">
              <PlusIcon className="size-5" />
              <span> New Day</span>
            </Link>
            <button className="btn btn-ghost btn-error" onClick={handleSignOut}>
              <LogOutIcon className="size-5" />
              <span className="ml-1">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
