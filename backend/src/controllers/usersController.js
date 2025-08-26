import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const expiry = "3d";
//Signup
//Note: /api/users/signup
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: expiry,
    });

    res.status(200).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    console.log("Error in signup controller:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

//Login
//Note: /api/users/signup
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: expiry,
    });

    res.status(200).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    console.log("Error in login controller:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

//Get the profile
//Note: /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select(" -password");
    if (!user) return res.stats(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error on getting user profile:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};
