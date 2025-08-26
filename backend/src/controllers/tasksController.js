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

//get all tasks of user

//get tasks on specified day

//get a single task by id

//update task

//delete task

//delete all task for a specific day
