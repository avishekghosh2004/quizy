import { useState } from "react";
import axios from "axios";

function App() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError("Please enter a role");
      return;
    }
    setError("");
    setLoading(true);
    setShowResults(false);
    setCurrentAnswers({});

    try {
      const res = await axios.post("http://localhost:5000/api/generate-quiz", {
        role: role.trim(),
      });

      if (!res.data || !res.data.success) {
        throw new Error("Invalid response format");
      }

      const parsedQuestions = parseQuestions(res.data.data);
      setQuestions(parsedQuestions);
    } catch (error) {
      console.error("Quiz generation error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleQuizSubmit = () => {
    if (Object.keys(currentAnswers).length < questions.length) {
      setError("Please answer all questions before submitting");
      return;
    }

    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (currentAnswers[index] === question.answer ? 1 : 0);
    }, 0);

    setScore(correctAnswers);
    setShowResults(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="fixed top-4 left-4">
        <span
          className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent 
          hover:scale-105 transform transition-transform duration-300 cursor-pointer"
        >
          Quizy
        </span>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl bg-black rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-zinc-800">
          <div className="relative bg-zinc-900/30 p-8 border-b border-zinc-800 rounded-t-2xl">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              AI Quiz Generator
            </h1>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-t-2xl pointer-events-none"></div>
          </div>

          <div className="p-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your role (e.g. frontend developer)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  className="w-full p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl text-zinc-100 
                    focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-zinc-600
                    transition-all duration-300 group-hover:border-zinc-700"
                />
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-900/50 text-red-200 px-6 py-4 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300
                  shadow-lg shadow-blue-500/0 hover:shadow-blue-500/10
                  ${
                    loading
                      ? "bg-blue-950/50 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating Quiz...
                  </div>
                ) : (
                  "Generate Quiz"
                )}
              </button>
            </form>

            {questions.length > 0 && !showResults && (
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-800 
                      hover:border-zinc-700 transition-all duration-300
                      hover:shadow-lg hover:shadow-blue-500/5"
                  >
                    <p className="text-xl font-semibold mb-6 text-zinc-100">
                      {i + 1}. {q.question}
                    </p>
                    <div className="space-y-3">
                      {Object.entries(q.options).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer
                            hover:bg-zinc-900/50 transition-all duration-200"
                        >
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={key}
                            checked={currentAnswers[i] === key}
                            onChange={() => handleAnswerSelect(i, key)}
                            className="form-radio h-5 w-5 text-blue-500 bg-black border-zinc-700"
                          />
                          <span className="text-zinc-300 text-lg">
                            {key}) {value}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleQuizSubmit}
                  className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 rounded-xl font-medium
                    transition-all duration-300 shadow-lg shadow-green-500/0 hover:shadow-green-500/10"
                >
                  Submit Quiz
                </button>
              </div>
            )}

            {showResults && (
              <div className="bg-zinc-900/30 rounded-xl p-8 border border-zinc-800">
                <h2 className="text-3xl font-bold mb-6 text-blue-400">
                  Quiz Results
                </h2>
                <div className="text-2xl text-zinc-100 mb-6">
                  Score: {score} out of {questions.length}
                  <span className="text-xl ml-3 text-zinc-400">
                    ({Math.round((score / questions.length) * 100)}%)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentAnswers({});
                  }}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium
                    transition-all duration-300 shadow-lg shadow-blue-500/0 hover:shadow-blue-500/10"
                >
                  Review Answers
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-black py-4 border-t border-zinc-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 font-medium text-sm">
              © 2025 Quizy. All rights reserved.
            </p>
            <p className="text-zinc-600 text-sm">Created by Avishek Ghosh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function parseQuestions(text) {
  const questions = [];
  const questionBlocks = text.split(/\d+\./).filter((block) => block.trim());

  questionBlocks.forEach((block) => {
    const lines = block.trim().split("\n");
    const questionLine = lines
      .find((line) => line.includes("Question:"))
      ?.replace("Question:", "")
      .trim();
    const options = {};
    let answer = "";

    lines.forEach((line) => {
      const optionMatch = line.match(/([A-D])\)(.*)/);
      if (optionMatch) {
        options[optionMatch[1]] = optionMatch[2].trim();
      }
      if (line.toLowerCase().includes("correct answer:")) {
        answer = line.match(/[A-D]/)?.[0] || "";
      }
    });

    if (questionLine && Object.keys(options).length === 4 && answer) {
      questions.push({
        question: questionLine,
        options,
        answer,
      });
    }
  });

  return questions;
}

export default App;
