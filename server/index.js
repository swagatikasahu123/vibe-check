const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model
const Vote = mongoose.model("Vote", new mongoose.Schema({
  vibe: String,
  timestamp: { type: Date, default: Date.now }
}));

// Emit updated results
async function broadcastResults() {
  const vibes = await Vote.aggregate([
    { $group: { _id: "$vibe", count: { $sum: 1 } } }
  ]);
  io.emit("updateResults", vibes);
}

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("submitQuiz", async (vibe) => {
    await Vote.create({ vibe });
    broadcastResults();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => res.send("Vibe Check Backend Running!"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));