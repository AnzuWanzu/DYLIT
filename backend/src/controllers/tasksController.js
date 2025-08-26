import Task from "../models/Task.js";
import Day from "../models/Day.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, hours, dayId } = req.body;
    const day = await Day.findOne({ _id: dayId, user: req.user });
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    const task = new Task({
      title,
      description,
      hours,
      day: dayId,
      user: req.user,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { dayId } = req.query;
    let filter = { user: req.user };

    if (dayId) filter.day = dayId;

    const tasks = await Task.find(filter)
      .populate("day", "date")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTasksByDay = async (req, res) => {
  try {
    const { dayId } = req.params;

    const day = await Day.findOne({ _id: dayId, user: req.user });
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    const tasks = await Task.find({ day: dayId, user: req.user }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by day:", error);
    res.status(500).json({ message: "Failed to fetch tasks for the day" });
  }
};

//get a single task by id

//update task

//delete task

//delete all task for a specific day
