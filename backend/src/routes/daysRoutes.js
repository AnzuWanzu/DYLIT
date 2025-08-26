import express from "express";
import { createDay, getDay, getDays } from "../controllers/daysController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createDay);

router.get("/", authMiddleware, getDays);

router.get("/:id", authMiddleware, getDay);

export default router;
