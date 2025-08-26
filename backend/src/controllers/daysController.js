import Day from "../models/Day.js";
import Task from "../models/Task.js"; // ADD THIS IMPORT

//create Day (should be only created once per day)
export const createDay = async (req, res) => {
  try {
    const { date, tasks } = req.body; // ADD TASKS HERE
    const existingDay = await Day.findOne({
      user: req.user,
      date: new Date(date),
    });
    if (existingDay) {
      return res
        .status(400)
        .json({ message: "Day for this date already exists." });
    }
    const day = new Day({ user: req.user, date });
    await day.save();

    // CREATE TASKS IF PROVIDED
    if (tasks && tasks.length > 0) {
      const taskPromises = tasks.map((task) => {
        return new Task({
          title: task.title,
          description: task.description,
          hours: task.hours,
          day: day._id,
          user: req.user,
        }).save();
      });
      await Promise.all(taskPromises);
    }

    // RETURN DAY WITH TASKS
    const dayWithTasks = await Day.findById(day._id);
    const dayTasks = await Task.find({ day: day._id });

    res.status(201).json({
      ...dayWithTasks.toObject(),
      tasks: dayTasks,
    });
  } catch (error) {
    console.log("Error creating day function:", error);
    res.status(500).json({ message: "Failed to create Day" });
  }
};

//get list of Days from the logged in user
export const getDays = async (req, res) => {
  try {
    const days = await Day.find({ user: req.user }).sort({ date: -1 });

    // OPTIONALLY ADD TASK COUNTS FOR EACH DAY
    const daysWithTaskCounts = await Promise.all(
      days.map(async (day) => {
        const taskCount = await Task.countDocuments({ day: day._id });
        const totalHours = await Task.aggregate([
          { $match: { day: day._id } },
          { $group: { _id: null, total: { $sum: "$hours" } } },
        ]);

        return {
          ...day.toObject(),
          taskCount,
          totalHours: totalHours[0]?.total || 0,
        };
      })
    );

    res.json(daysWithTaskCounts);
  } catch (error) {
    console.log("Error getting list of days by logged in user:", error);
    res.status(500).json({ message: "Failed to fetch days" });
  }
};

//get a single day by ID
export const getDay = async (req, res) => {
  try {
    const day = await Day.findOne({ _id: req.params.id, user: req.user });
    if (!day) return res.status(404).json({ message: "Day not found" });

    // GET TASKS FOR THIS DAY
    const tasks = await Task.find({ day: req.params.id, user: req.user }).sort({
      createdAt: -1,
    });

    // CALCULATE TOTAL HOURS
    const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);

    res.json({
      ...day.toObject(),
      tasks,
      totalHours,
      taskCount: tasks.length,
    });
  } catch (error) {
    console.log("Error getting day by logged in user:", error);
    res.status(500).json({ message: "Failed to fetch day" });
  }
};

//delete a day
export const deleteDay = async (req, res) => {
  try {
    const day = await Day.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });
    if (!day) return res.status(404).json({ message: "Day not found" });

    // DELETE ALL ASSOCIATED TASKS
    await Task.deleteMany({ day: req.params.id, user: req.user });

    res.json({ message: "Day and associated tasks deleted" });
  } catch (error) {
    console.log("Error deleting a day:", error);
    res.status(500).json({ message: "Failed to delete day" });
  }
};
