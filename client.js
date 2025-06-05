import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.emit("join", (userId) => {
  console.log(`User ${userId} has joined the session`);
})

socket.on("new-submission", (data) => {
  console.log("Producer submitted a track", data.track);
});

socket.on("new-feedback", (data) => {
  console.log("DJ sent feedback", data.message);
});