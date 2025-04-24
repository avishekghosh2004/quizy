import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables");
  process.exit(1);
}

try {
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  router.post("/generate-quiz", async (req, res) => {
    try {
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      const quizPrompt = `Generate 10 multiple choice questions about ${role}. 
      Format each question exactly like this:
      Question: [question text]
      A) [option A]
      B) [option B]
      C) [option C]
      D) [option D]
      Correct Answer: [letter]

      Return all questions in a clear, numbered format.`;

      const quizResult = await model.generateContent(quizPrompt);

      if (!quizResult || !quizResult.response) {
        throw new Error("No response from AI model");
      }

      const text = quizResult.response.text();
      console.log("Quiz Generation:", text);

      res.json({ success: true, data: text });
    } catch (error) {
      console.error("API Error Details:", error);
      res.status(500).json({
        message: "Quiz generation failed",
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.toString() : undefined,
      });
    }
  });
} catch (initError) {
  console.error("Gemini AI Initialization Error:", initError);
  process.exit(1);
}

export default router;
