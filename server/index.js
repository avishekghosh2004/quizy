import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quizRouter from "./routes/quiz.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", quizRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
