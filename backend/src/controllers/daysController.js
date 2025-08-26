import Day from "../models/Day.js";

//create Day (should be only created once per day)
export const createDay = async (req, res) => {
  try {
    const { date } = req.body;
    const day = new Day({ user: req.user, date });
    await day.save();

    res.status(201).json(day);
  } catch (error) {
    console.log("Error creating day function:", error);
    res.status(500).json({ message: "Failed to create Day" });
  }
};

//get list of Days from the logged in user

//get a single day by ID

//delete a day
