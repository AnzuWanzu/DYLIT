import Task from "../models/Task.js";
import Day from "../models/Day.js";
import {
  validateTaskInput,
  validateDailyHoursLimit,
  getHoursLimitErrorMessage,
} from "../lib/validator.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, hours, dayId } = req.body;

    const inputValidation = validateTaskInput(title, description, hours);
    if (!inputValidation.isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: inputValidation.errors,
      });
    }

    const day = await Day.findOne({ _id: dayId, user: req.user });
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    const hoursValidation = await validateDailyHoursLimit(
      hours,
      dayId,
      req.user
    );
    if (!hoursValidation.isValid) {
      const errorMessage =
        hoursValidation.error ||
        getHoursLimitErrorMessage(
          Number(hours),
          hoursValidation.newTotal,
          hoursValidation.remainingHours
        );
      return res.status(400).json({
        message: errorMessage,
        currentTotal: hoursValidation.currentTotal,
        remainingHours: hoursValidation.remainingHours,
        maxHours: hoursValidation.maxHours,
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description.trim(),
      hours: Number(hours),
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

//get tasks
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

//get tasks by dayid
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
export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user,
    }).populate("day", "date");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

//update task
export const updateTask = async (req, res) => {
  try {
    const { title, description, hours } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      title !== undefined ||
      description !== undefined ||
      hours !== undefined
    ) {
      const inputValidation = validateTaskInput(
        title !== undefined ? title : task.title,
        description !== undefined ? description : task.description,
        hours !== undefined ? hours : task.hours
      );

      if (!inputValidation.isValid) {
        return res.status(400).json({
          message: "Validation failed",
          errors: inputValidation.errors,
        });
      }
    }

    if (hours !== undefined && Number(hours) !== task.hours) {
      const hoursValidation = await validateDailyHoursLimit(
        hours,
        task.day,
        req.user,
        task._id
      );

      if (!hoursValidation.isValid) {
        const errorMessage =
          hoursValidation.error ||
          getHoursLimitErrorMessage(
            Number(hours),
            hoursValidation.newTotal,
            hoursValidation.remainingHours,
            true // This is an update
          );
        return res.status(400).json({
          message: errorMessage,
          currentTotal: hoursValidation.currentTotal,
          remainingHours: hoursValidation.remainingHours,
          maxHours: hoursValidation.maxHours,
        });
      }
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (hours !== undefined) task.hours = Number(hours);

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
};

//delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

//delete all task for a specific day
export const deleteTasksByDay = async (req, res) => {
  try {
    const { dayId } = req.params;

    // Validate if the day exists and belongs to the user
    const day = await Day.findOne({ _id: dayId, user: req.user });
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    const result = await Task.deleteMany({ day: dayId, user: req.user });

    res.json({
      message: "Tasks deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting tasks by day:", error);
    res.status(500).json({ message: "Failed to delete tasks" });
  }
};
