import express from "express";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

//Middleware stuff
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/users", userRoutes);

//test route
app.get("/", (req, res) => res.send("Time tracker api is running"));

//DB connection
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
});
