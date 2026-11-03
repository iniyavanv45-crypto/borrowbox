const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allows any frontend (like your Netlify site) to connect
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname));

let activeUsers = 0;

io.on('connection', (socket) => {
    console.log('A user connected');
    activeUsers++;
    io.emit('active_users', activeUsers);
    
    // Broadcast search event to all other connected clients
    socket.on('search', (data) => {
        console.log(`${data.username} searched for: ${data.query}`);
        socket.broadcast.emit('search_notification', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        activeUsers--;
        io.emit('active_users', activeUsers);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
