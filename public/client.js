const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    let username;

    socket.on('join', (name) => {
        username = name;
        socket.join(username); // Join a room based on username
        socket.emit('message', `Welcome ${username}`);
        socket.broadcast.to(username).emit('message', `${username} has joined the chat`);
    });

    socket.on('chat message', (msg) => {
        io.to(username).emit('chat message', { text: msg, user: username });
    });

    socket.on('disconnect', () => {
        socket.broadcast.to(username).emit('message', `${username} has left the chat`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
