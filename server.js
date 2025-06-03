import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const users = {};
const rooms = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('register', (username) => {
        users[socket.id] = username;
        console.log(`Registered ${username}`);
    });

    socket.on('send_private_message', ({ to, message }) => {
        const targetSocketId = Object.keys(users).find(
            (key) => users[key] === to
        );
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive_private_message', {
                from: users[socket.id],
                message,
            });
        }
    });

    socket.on('join_room', (room) => {
        socket.join(room);
        rooms[room] = rooms[room] || [];
        rooms[room].push(socket.id);
        console.log(`${users[socket.id]} joined room ${room}`);
    });

    socket.on('send_room_message', ({ room, message }) => {
        io.to(room).emit('receive_room_message', {
            from: users[socket.id],
            message,
        });
    });

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} disconnected`);
        delete users[socket.id];
    });
});

app.get('/users', (req, res) => {
    res.json(Object.values(users));
});

app.get('/rooms', (req, res) => {
    res.json(Object.keys(rooms));
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});