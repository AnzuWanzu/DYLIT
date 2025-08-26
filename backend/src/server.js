import express from "express";
import userRoutes from "./routes/userRoutes.js";
import daysRoutes from "./routes/daysRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

//Middleware stuff
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/days", daysRoutes);
app.use("/api/tasks", tasksRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

//DB connection
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
});
