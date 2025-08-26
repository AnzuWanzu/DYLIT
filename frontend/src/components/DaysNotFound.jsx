import { CalendarDaysIcon } from "lucide-react";
import { Link } from "react-router-dom";

const DaysNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-accent/10 rounded-full p-8">
        <CalendarDaysIcon className="size-10 text-accent" />
      </div>
      <h3 className="text-2xl font-bold">No days yet</h3>
      <p className="text-base-content/70">
        Ready to lock in your progress? Create your first day to start tracking
        your time!
      </p>
      <Link to="/create" className="btn btn-active btn-accent">
        Create Your First Day
      </Link>
    </div>
  );
};

export default DaysNotFound;
