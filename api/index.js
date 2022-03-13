import express, { json } from 'express'
import { config } from 'dotenv'
import { Server } from 'socket.io';
import { connectDB } from './dbConnect.js'
import route from './routers/index.js';

config()
connectDB()
const app = express()
app.use(json())

const PORT = process.env.PORT || 5000
app.use('/api', route)
const server = app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})

const io = new Server(server,{
    pingTimeout: 5000,
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        const chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})







