import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

// socker users map to store online users
const userSocketMap = {}; //{userId,socketId}

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // get the userId from client and add into the userSocketMap to update or add the online users
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // socket.on("typing", (data) => {
  //   socket.broadcast.emit("typing", data);
  //   console.log(data);
  // });

  socket.on("typing", (data) => {
    // forward only to receiver
    io.to(userSocketMap[data.receiverId]).emit("typing", data);
  });

  // socket.on("dummy", (data) => {
  //   console.log("SenderId: ", data.senderId);
  //   console.log("RecieverId: ", data.recieverId);
  // });
});

export { io, app, server };
