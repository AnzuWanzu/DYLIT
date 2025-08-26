import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      expiresIn: "3d",
    });
    res.status(200).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Login
//Note: /api/users/signup

//Get the profile
//Note: /api/users/profile
