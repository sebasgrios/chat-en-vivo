const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./db");
const Connection = require("./models/Connection");
const Message = require("./models/Message");

connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

io.on("connection", (socket) => {
  console.log(`🟢 Usuario conectado ${socket.id}`);

  socket.on("username", async (username) => {
    const newConnection = new Connection({
      socketId: socket.id,
      username: username
    });
    newConnection.save().catch(err => console.error(err));

    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit("chat-history", messages);
  });

  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username);
  });

  socket.on("stop-typing", () => {
    socket.broadcast.emit("stop-typing");
  });

  socket.on("chat-message", (username, data) => {
    const newMessage = new Message({
      username,
      message: data
    });
    newMessage.save().catch(err => console.error(err));

    socket.broadcast.emit("chat-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Usuario desconectado ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});