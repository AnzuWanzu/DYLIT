import express from "express";
import {
  createTask,
  getTasks,
  getTasksByDay,
  getTask,
  updateTask,
  deleteTask,
  deleteTasksByDay,
} from "../controllers/tasksController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.get("/day/:dayId", authMiddleware, getTasksByDay);

router.get("/:id", authMiddleware, getTask);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.delete("/day/:dayId", authMiddleware, deleteTasksByDay);

export default router;
