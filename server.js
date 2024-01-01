//const { Socket } = require("dgram");
const express = require('express');
const app = express();
const path = require('path');

const http = require('http');
const {Server} = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

const ACTIONS = require( './src/Actions');

const moment = require('moment');

const userSocketMap = {};

app.use(express.static("build"));

app.use((req,res,next) =>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    });
}

function formatMessage(username, text) {
    return {
      username,
      text,
      time: moment().format('D/MM/YYYY hh:mm a')
    }
}

io.on('connection', (socket) => {
    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    

    socket.on('chatMessage', ({roomId, message}) =>{
        const SendingUser = userSocketMap[socket.id];
        io.to(roomId).emit('Message', formatMessage(SendingUser, message));
    }) 


    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
    })
});

const PORT = 5555 || process.env.PORT ;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));