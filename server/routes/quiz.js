import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Add retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables");
  process.exit(1);
}

try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
  });

  // Add generateWithRetry function
  const generateWithRetry = async (prompt, retries = MAX_RETRIES) => {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      if (error.status === 503 && retries > 0) {
        console.log(`Retrying... ${retries} attempts remaining`);
        await delay(RETRY_DELAY);
        return generateWithRetry(prompt, retries - 1);
      }
      throw error;
    }
  };

  router.post("/generate-quiz", async (req, res) => {
    try {
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      const quizPrompt = `Generate 10 multiple choice questions about ${role}.
      Format each question exactly like this:
     1. Question: [question text]
A) [option text]
B) [option text]
C) [option text]
D) [option text]
Correct Answer: [letter]
      Correct Answer: [letter]

      Return all questions in a clear, numbered format.`;

      console.log("Sending prompt to Gemini...");
      const result = await generateWithRetry(quizPrompt);
      const response = await result.response;
      const text = response.text();

      res.json({
        success: true,
        data: {
          text: text,
          role: role,
        },
      });
    } catch (error) {
      console.error("Quiz Generation Error:", error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message,
      });
    }
  });
} catch (initError) {
  console.error("Gemini AI Initialization Error:", initError);
  process.exit(1);
}

export default router;
