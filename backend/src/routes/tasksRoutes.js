import express from "express";
import { createTask } from "../controllers/tasksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);

export default router;
