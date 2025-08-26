import Day from "../models/Day.js";

//create Day (should be only created once per day)
export const createDay = async (req, res) => {
  try {
    const { date } = req.body;
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
    res.status(201).json(day);
  } catch (error) {
    console.log("Error creating day function:", error);
    res.status(500).json({ message: "Failed to create Day" });
  }
};

//get list of Days from the logged in user
export const getDays = async (req, res) => {
  try {
    const days = await Day.find({ user: req.user }).sort({ date: -1 });
    res.json(days);
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
    res.json(day);
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
    res.json({ message: "Day deleted" });
  } catch (error) {
    console.log("Error deleting a day:", error);
    res.status(500).json({ message: "Failed to delete day" });
  }
};
