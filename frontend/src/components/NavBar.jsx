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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center min-w-[220px]">
            <h1 className="text-4xl font-black font-serif tracking-widest text-primary drop-shadow-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent select-none mr-2">
              DYLIT
            </h1>
            <span className="ml-2 text-base-content/70 text-lg italic font-medium">
              (Did you lock in today?)
            </span>
          </div>
          <div className="flex items-center gap-4 flex-grow justify-end">
            <Link to={"/create"} className="btn btn-active btn-accent">
              <PlusIcon className="size-5" />
              <span> New Day</span>
            </Link>
            <button
              className="btn btn-ghost btn-error text-sm px-2 ml-8"
              style={{ minWidth: "90px" }}
              onClick={handleSignOut}
            >
              <LogOutIcon className="size-4" />
              <span className="ml-1">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
