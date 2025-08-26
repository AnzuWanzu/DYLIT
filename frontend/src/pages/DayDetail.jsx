import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { formatDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const DayDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDay = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/days/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDay(res.data);
      } catch (error) {
        // handle error (e.g., toast)
      } finally {
        setLoading(false);
      }
    };
    fetchDay();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!day) return <div className="text-center mt-10">Day not found.</div>;

  const createdTime = new Date(day.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gradient-to-br from-base-100 via-base-200 to-accent/10 border-l-4 border-accent shadow-2xl rounded-xl p-8">
      <div className="flex justify-start">
        <Link
          to="/"
          className="btn btn-ghost mb-6 flex items-center gap-2 px-3 py-1 min-w-0 w-auto"
          style={{ maxWidth: "fit-content" }}
        >
          <ArrowLeftIcon className="size-5" />
          Back to Notes
        </Link>
      </div>
      <h1 className="text-3xl font-extrabold text-primary mb-6 font-mono tracking-wide">
        {formatDate(day.date)}{" "}
        <span className="text-base-content/70 text-lg font-normal">
          (Today)
        </span>
      </h1>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between">
          <span className="font-semibold font-mono">Created At:</span>
          <span className="font-bold text-base-content/80 font-mono">
            {createdTime}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold font-mono">Tasks:</span>
          <span className="font-bold text-accent font-mono">
            {day.tasks ? day.tasks.length : 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold font-mono">Hours Focused:</span>
          <span className="font-bold text-accent font-mono">
            {day.hoursFocused || "0hrs 00 mins"}
          </span>
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <button className="btn btn-accent btn-sm flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Task
        </button>
        <button className="btn btn-error btn-sm flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Delete Tasks
        </button>
      </div>
    </div>
  );
};

export default DayDetail;
