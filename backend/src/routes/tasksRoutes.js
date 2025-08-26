import express from "express";
import {
  createTask,
  getTasks,
  getTasksByDay,
} from "../controllers/tasksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.get("/day/:dayId", authMiddleware, getTasksByDay);

export default router;
