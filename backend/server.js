import express from "express";
import userRoutes from "./src/routes/userRoutes";

const app = express();
const PORT = 5002;

app.use("api/users/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
