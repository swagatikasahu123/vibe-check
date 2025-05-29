import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const ResultPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    socket.on("updateResults", (data) => {
      setResults(data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Live Vibe Results</h1>
      <ul>
        {results.map((vibe, i) => (
          <li key={i} className="my-2">
            {vibe._id}: {vibe.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultPage;