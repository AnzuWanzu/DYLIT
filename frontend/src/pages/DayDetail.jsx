import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { formatDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, TimerIcon } from "lucide-react";
import { Trash2Icon, PencilIcon } from "lucide-react";
import toast from "react-hot-toast";

const DayDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editHours, setEditHours] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskHours, setTaskHours] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDayLoading, setDeleteDayLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchDay = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get(`/days/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDay(res.data);
    } catch (error) {
      console.error("Fetch day error:", error);
      toast.error("Failed to load day details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (idx) => {
    setEditIdx(idx);
    setEditTitle(day.tasks[idx].title);
    setEditDesc(day.tasks[idx].description);
    setEditHours(day.tasks[idx].hours);
  };

  const handleUpdateTask = async (idx) => {
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
    if (updateLoading) return;

    setUpdateLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/tasks/${day.tasks[idx]._id}`,
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
      toast.success("Task updated successfully!");
      await fetchDay();
    } catch (error) {
      console.error("Update task error:", error);
      toast.error("Failed to update task");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteTask = async (idx) => {
    if (deleteLoading) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/tasks/${day.tasks[idx]._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted successfully!");
      await fetchDay();
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchDay();
  }, [id]);

  const handleAddTask = async () => {
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
    if (addLoading) return;

    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/tasks`,
        {
          title: taskTitle,
          description: taskDesc,
          hours: Number(taskHours),
          dayId: id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskTitle("");
      setTaskDesc("");
      setTaskHours("");
      setShowAddTask(false);
      toast.success("Task added successfully!");
      await fetchDay();
    } catch (error) {
      console.error("Add task error:", error);
      toast.error("Failed to add task");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteDay = async () => {
    if (deleteDayLoading) return;

    setDeleteDayLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/days/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Day and all tasks deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Delete day error:", error);
      toast.error("Failed to delete day");
    } finally {
      setDeleteDayLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDeleteDay = () => {
    setShowDeleteConfirm(true);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!day) return <div className="text-center mt-10">Day not found.</div>;

  const createdTime = new Date(day.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gradient-to-br from-base-100 via-base-200 to-accent/10 border-l-4 border-accent shadow-2xl rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="btn btn-ghost flex items-center gap-2 px-3 py-1"
        >
          <ArrowLeftIcon className="size-5" />
          Back to Home
        </Link>

        <button
          onClick={confirmDeleteDay}
          disabled={deleteDayLoading}
          className="btn btn-error btn-sm flex items-center gap-2"
        >
          <Trash2Icon className="size-4" />
          {deleteDayLoading ? "Deleting..." : "Delete Day"}
        </button>
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
            {day.totalHours || 0} hours
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-error/20 rounded-full">
                <Trash2Icon className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-lg font-bold text-base-content">
                Delete Day
              </h3>
            </div>

            <p className="text-base-content/80 mb-6">
              Are you sure you want to delete this day and all its tasks?
              <span className="block mt-2 text-error font-semibold">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteDayLoading}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDay}
                disabled={deleteDayLoading}
                className="btn btn-error"
              >
                {deleteDayLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2Icon className="w-4 h-4" />
                    Delete Day
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayDetail;
