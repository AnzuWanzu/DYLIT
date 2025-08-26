import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlusIcon,
  Trash2Icon,
  CalendarIcon,
  TimerIcon,
  PencilIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { formatDate } from "../lib/utils";

const CreateDayPage = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskHours, setTaskHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editHours, setEditHours] = useState("");
  const handleEditTask = (idx) => {
    setEditIdx(idx);
    setEditTitle(tasks[idx].title);
    setEditDesc(tasks[idx].description);
    setEditHours(tasks[idx].hours);
  };

  const handleUpdateTask = (idx) => {
    if (!editTitle.trim()) {
      toast.error("Task title required");
      return;
    }
    if (!editDesc.trim()) {
      toast.error("Task description required");
      return;
    }
    if (!editHours || isNaN(editHours) || Number(editHours) <= 0) {
      toast.error("Valid hours worked required");
      return;
    }
    const updatedTasks = tasks.map((task, i) =>
      i === idx
        ? {
            ...task,
            title: editTitle,
            description: editDesc,
            hours: Number(editHours),
          }
        : task
    );
    setTasks(updatedTasks);
    setEditIdx(null);
    setEditTitle("");
    setEditDesc("");
    setEditHours("");
  };
  const navigate = useNavigate();

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      toast.error("Task title required");
      return;
    }
    if (!taskDesc.trim()) {
      toast.error("Task description required");
      return;
    }
    if (!taskHours.trim() || isNaN(taskHours) || Number(taskHours) <= 0) {
      toast.error("Valid hours worked required");
      return;
    }
    setTasks([
      ...tasks,
      {
        title: taskTitle,
        description: taskDesc,
        hours: Number(taskHours),
      },
    ]);
    setTaskTitle("");
    setTaskDesc("");
    setTaskHours("");
  };

  const handleDeleteTask = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/days",
        { date, tasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Day created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create day");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="btn btn-ghost mb-6 flex items-center gap-2 px-3 py-1 min-w-0 w-auto"
            style={{ maxWidth: "fit-content" }}
          >
            <ArrowLeftIcon className="size-5" />
            Back to Days
          </Link>
          <div className="card bg-gradient-to-br from-base-100 via-base-200 to-accent/10 border-l-4 border-accent shadow-2xl rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Day</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label flex gap-2 items-center">
                    <CalendarIcon className="size-5 text-accent" />
                    <span className="label-text mb-2">Select Day</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <span className="mt-2 text-base-content/70">
                    Selected: {formatDate(date)}
                  </span>
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text mb-2">Add Task</span>
                  </label>
                  <div className="bg-base-100 border border-accent rounded-xl p-4 shadow flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Task title"
                        className="input input-bordered"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-primary">
                        Description
                      </label>
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
                    <button
                      type="button"
                      className="btn btn-accent mt-2 self-end"
                      onClick={handleAddTask}
                    >
                      <PlusIcon className="size-4" /> Add Task
                    </button>
                  </div>
                </div>
                {tasks.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Tasks for the Day</h3>
                    <ul className="space-y-2">
                      {tasks.map((task, idx) => (
                        <li
                          key={idx}
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
                                    onChange={(e) =>
                                      setEditHours(e.target.value)
                                    }
                                    placeholder="Hours worked"
                                  />
                                  <span className="text-accent font-bold">
                                    hrs
                                  </span>
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
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-active btn-accent"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Day"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDayPage;
