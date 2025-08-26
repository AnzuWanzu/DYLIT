import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { formatDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, TimerIcon } from "lucide-react";
import { Trash2Icon, PencilIcon } from "lucide-react";

const DayDetail = () => {
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editHours, setEditHours] = useState("");

  const handleEditTask = (idx) => {
    setEditIdx(idx);
    setEditTitle(day.tasks[idx].title);
    setEditDesc(day.tasks[idx].description);
    setEditHours(day.tasks[idx].hours);
  };

  const handleUpdateTask = async (idx) => {
    if (!editTitle.trim()) return;
    if (!editDesc.trim()) return;
    if (!editHours || isNaN(editHours) || Number(editHours) <= 0) return;
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/days/${id}/tasks/${day.tasks[idx]._id}`,
        {
          title: editTitle,
          description: editDesc,
          hours: Number(editHours),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditIdx(null);
      setEditTitle("");
      setEditDesc("");
      setEditHours("");
      // Optionally, refetch day/tasks here
    } catch (error) {
      // handle error
    }
  };

  const handleDeleteTask = async (idx) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/days/${id}/tasks/${day.tasks[idx]._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // handle error
    }
  };
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskHours, setTaskHours] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      // toast.error("Task title required");
      return;
    }
    if (!taskDesc.trim()) {
      // toast.error("Task description required");
      return;
    }
    if (!taskHours.trim() || isNaN(taskHours) || Number(taskHours) <= 0) {
      // toast.error("Valid hours worked required");
      return;
    }
    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/days/${id}/tasks`,
        {
          title: taskTitle,
          description: taskDesc,
          hours: Number(taskHours),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskTitle("");
      setTaskDesc("");
      setTaskHours("");
      setShowAddTask(false);
    } catch (error) {
      // toast.error("Failed to add task");
    } finally {
      setAddLoading(false);
    }
  };
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
          Back to Home
        </Link>
      </div>
      <h1 className="text-3xl font-extrabold text-primary mb-6 font-mono tracking-wide">
        {formatDate(day.date)}{" "}
        <span className="text-base-content/70 text-lg font-normal"></span>
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
      {/* Render Tasks for the Day section outside the summary stats */}
      {day.tasks && day.tasks.length > 0 && (
        <div className="mb-4 mt-8">
          <h3 className="font-bold mb-2">Tasks for the Day</h3>
          <ul className="space-y-2">
            {day.tasks.map((task, idx) => (
              <li
                key={task._id || idx}
                className="bg-base-200 rounded px-3 py-2 flex flex-col gap-1 relative"
              >
                <button
                  type="button"
                  className="btn btn-xs btn-error absolute top-2 right-2"
                  onClick={() => handleDeleteTask(idx)}
                >
                  <Trash2Icon className="size-4" />
                </button>
                {editIdx === idx ? (
                  <div className="bg-base-100 border border-accent rounded-xl p-4 shadow flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary">
                        Title
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary">
                        Description
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary flex items-center gap-2">
                        <TimerIcon className="size-5 text-accent" />
                        Hours Worked
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          className="input input-bordered w-24"
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          placeholder="Hours worked"
                        />
                        <span className="text-accent font-bold">hrs</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-success btn-sm self-end"
                      onClick={() => handleUpdateTask(idx)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-primary flex items-center gap-2">
                      Title: {task.title}
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => handleEditTask(idx)}
                        title="Edit Task"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                    </span>
                    <span className="text-base-content/80">
                      Description: {task.description}
                    </span>
                    <span className="text-accent font-mono">
                      Hours worked: {task.hours}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-4 justify-end">
        <button
          className="btn btn-accent btn-sm flex items-center gap-2"
          onClick={() => setShowAddTask((v) => !v)}
        >
          <PlusIcon className="size-4" />
          Add Task
        </button>
        <button className="btn btn-error btn-sm flex items-center gap-2">
          <Trash2Icon className="size-4" />
          Delete Tasks
        </button>
      </div>
      {showAddTask && (
        <div className="bg-base-100 border border-accent rounded-xl p-4 shadow flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-primary">Title</label>
            <input
              type="text"
              placeholder="Task title"
              className="input input-bordered"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-primary">Description</label>
            <input
              type="text"
              placeholder="Task description"
              className="input input-bordered"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-primary flex items-center gap-2">
              <TimerIcon className="size-5 text-accent" />
              Hours Worked
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 2.5"
                className="input input-bordered w-32"
                value={taskHours}
                onChange={(e) => setTaskHours(e.target.value)}
              />
              <span className="text-accent font-bold">hrs</span>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleAddTask}
              disabled={addLoading}
            >
              {addLoading ? "Adding..." : "Add Task"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowAddTask(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {day.tasks && day.tasks.length > 0 && (
        <div className="mb-4 mt-8">
          <h3 className="font-bold mb-2">Tasks for the Day</h3>
          <ul className="space-y-2">
            {day.tasks.map((task, idx) => (
              <li
                key={task._id || idx}
                className="bg-base-200 rounded px-3 py-2 flex flex-col gap-1 relative"
              >
                <button
                  type="button"
                  className="btn btn-xs btn-error absolute top-2 right-2"
                  onClick={() => handleDeleteTask(idx)}
                >
                  <Trash2Icon className="size-4" />
                </button>
                {editIdx === idx ? (
                  <div className="bg-base-100 border border-accent rounded-xl p-4 shadow flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary">
                        Title
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary">
                        Description
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary flex items-center gap-2">
                        <TimerIcon className="size-5 text-accent" />
                        Hours Worked
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          className="input input-bordered w-24"
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          placeholder="Hours worked"
                        />
                        <span className="text-accent font-bold">hrs</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-success btn-sm self-end"
                      onClick={() => handleUpdateTask(idx)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-primary flex items-center gap-2">
                      Title: {task.title}
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost"
                        onClick={() => handleEditTask(idx)}
                        title="Edit Task"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                    </span>
                    <span className="text-base-content/80">
                      Description: {task.description}
                    </span>
                    <span className="text-accent font-mono">
                      Hours worked: {task.hours}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DayDetail;
