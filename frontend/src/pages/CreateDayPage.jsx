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
import {
  validateTaskInput,
  checkDailyHoursLimit,
  getDailyHoursProgress,
  formatHours,
  MAX_DAILY_HOURS,
  calculateTotalHours,
} from "../lib/validator";

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
    const validation = validateTaskInput(editTitle, editDesc, editHours);
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    const hoursCheck = checkDailyHoursLimit(tasks, editHours, tasks[idx].title);
    if (!hoursCheck.isValid) {
      toast.error(
        `Cannot update to ${formatHours(
          editHours
        )} hours. Total would be ${formatHours(
          hoursCheck.newTotal
        )} hours, exceeding ${MAX_DAILY_HOURS}-hour limit. You have ${formatHours(
          hoursCheck.remainingHours
        )} hours remaining.`
      );
      return;
    }

    const updatedTasks = tasks.map((task, i) =>
      i === idx
        ? {
            ...task,
            title: editTitle.trim(),
            description: editDesc.trim(),
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
    const validation = validateTaskInput(taskTitle, taskDesc, taskHours);
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    const hoursCheck = checkDailyHoursLimit(tasks, taskHours);
    if (!hoursCheck.isValid) {
      toast.error(
        `Cannot add ${formatHours(
          taskHours
        )} hours. Total would be ${formatHours(
          hoursCheck.newTotal
        )} hours, exceeding ${MAX_DAILY_HOURS}-hour limit. You have ${formatHours(
          hoursCheck.remainingHours
        )} hours remaining.`
      );
      return;
    }

    setTasks([
      ...tasks,
      {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
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

      const dayResponse = await api.post(
        "/days",
        { date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdDay = dayResponse.data;

      if (tasks.length > 0) {
        const taskPromises = tasks.map((task) =>
          api.post(
            "/tasks",
            {
              title: task.title,
              description: task.description,
              hours: task.hours,
              dayId: createdDay._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

        await Promise.all(taskPromises);
      }

      toast.success("Day created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating day:", error);

      if (error.response?.status === 400) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err) => toast.error(err));
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error("Validation failed");
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create day");
      }
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
            Back to Home
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

                {/* Daily Progress Section */}
                {tasks.length > 0 &&
                  (() => {
                    const totalHours = calculateTotalHours(tasks);
                    const progress = getDailyHoursProgress(totalHours);
                    return (
                      <div className="mb-6 p-4 bg-base-100 border border-accent/20 rounded-xl shadow">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              <TimerIcon className="size-5 text-accent" />
                              Daily Progress Summary
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-mono font-bold text-accent">
                                {formatHours(totalHours)} / {MAX_DAILY_HOURS}{" "}
                                hours
                              </span>
                              <span
                                className={`badge ${progress.styling.badge} font-mono text-xs`}
                              >
                                {progress.statusText}
                              </span>
                            </div>
                          </div>

                          <div className="w-full">
                            <progress
                              className={`progress ${progress.styling.progressColor} w-full h-4`}
                              value={progress.percentage}
                              max="100"
                            ></progress>
                          </div>

                          <div className="flex justify-between text-sm font-mono">
                            <span className={progress.styling.color}>
                              {progress.percentage}% of daily target
                            </span>
                            {!progress.isOverLimit && (
                              <span className="text-base-content/60">
                                {formatHours(progress.remainingHours)} hours
                                remaining
                              </span>
                            )}
                            {progress.isOverLimit && (
                              <span className="text-error font-bold">
                                ⚠️ Over limit by{" "}
                                {formatHours(totalHours - MAX_DAILY_HOURS)}{" "}
                                hours!
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-base-content/70 pt-2 border-t border-base-300">
                            <span className="font-semibold">
                              {tasks.length} task{tasks.length !== 1 ? "s" : ""}{" "}
                              planned
                            </span>
                            {progress.percentage > 75 &&
                              !progress.isOverLimit && (
                                <span className="ml-2 text-warning">
                                  • Approaching daily limit
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

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
                                Hours worked: {formatHours(task.hours)}
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
