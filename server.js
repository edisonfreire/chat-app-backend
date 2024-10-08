const express = require('express');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Node JS + Socket app listening on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: '*', // avoid CORS issue
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      if (!onlineUsers.includes(userId)) { // doesnt matter many times refresh
        onlineUsers.push(userId);
      }
      
      console.log('onlineUsers', onlineUsers);
    }
  });

  socket.on('logout', (userId) => {
    socket.leave(userId);
    onlineUsers = onlineUsers.filter((user) => user !== userId);
    console.log('onlineUsers', onlineUsers);
  });
});

app.get('/', (req, res) => {
  return res.send('Chat App Node JS + Socket Server');
});

