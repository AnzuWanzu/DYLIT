import express from "express";
import { signup } from "../controllers/usersController";

const router = express.Router();

router.post("/signup", signup);

export default router;
