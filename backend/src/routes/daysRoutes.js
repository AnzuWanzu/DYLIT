import express from "express";
import { createDay } from "../controllers/daysController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createDay);

export default router;
