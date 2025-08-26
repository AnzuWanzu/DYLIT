import { Link } from "react-router-dom";
import { formatDate } from "../lib/utils";

const CreateDayCard = ({ day }) => {
  const tasksDone = day.tasks ? day.tasks.length : 0;
  const hoursFocused = day.hoursFocused || "0hrs 00 mins";
  const createdAt = new Date(day.createdAt);
  const createdTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      to={`/day/${day._id}`}
      className="card bg-gradient-to-br from-base-100 via-base-200 to-accent/10 border-l-4 border-accent shadow-xl rounded-xl p-5 transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl"
      style={{ backgroundColor: "#191919" }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary">Date:</span>
          <span className="text-lg font-extrabold text-accent">
            {formatDate(day.date)} (Today)
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-base-content">Created At:</span>
          <span className="font-bold text-base-content/80">{createdTime}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-base-content">Tasks:</span>
          <span className="font-bold text-accent">{tasksDone}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-base-content">
            Hours Focused:
          </span>
          <span className="font-bold text-accent">{hoursFocused}</span>
        </div>
      </div>
    </Link>
  );
};

export default CreateDayCard;
