import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const questions = [
  {
    question: "What's your ideal Friday night?",
    options: [
      { text: "Partying", vibe: "Chaotic Good" },
      { text: "Netflix and chill", vibe: "Calm Neutral" },
      { text: "Reading a book", vibe: "Wise Neutral" },
    ],
  },
  {
    question: "Pick a color",
    options: [
      { text: "Red", vibe: "Chaotic Good" },
      { text: "Blue", vibe: "Calm Neutral" },
      { text: "Grey", vibe: "Wise Neutral" },
    ],
  },
];

const QuizPage = () => {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

  const handleAnswer = (vibe) => {
    setScores((prev) => ({ ...prev, [vibe]: (prev[vibe] || 0) + 1 }));
    if (current + 1 < questions.length) setCurrent(current + 1);
    else {
      const result = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      socket.emit("submitQuiz", result);
      navigate("/results");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{questions[current].question}</h1>
      {questions[current].options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(opt.vibe)}
          className="block bg-blue-200 hover:bg-blue-300 m-2 px-4 py-2 rounded"
        >
          {opt.text}
        </button>
      ))}
    </div>
  );
};

export default QuizPage;
