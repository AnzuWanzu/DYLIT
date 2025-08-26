import express from "express";
import {
  createDay,
  getDay,
  getDays,
  deleteDay,
} from "../controllers/daysController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createDay);

router.get("/", authMiddleware, getDays);

router.get("/:id", authMiddleware, getDay);

router.delete("/:id", authMiddleware, deleteDay);

export default router;
