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
      if (!onlineUsers.includes(userId)) { // doesnt matter how many times refresh
        onlineUsers.push(userId);
      }

      onlineUsers.forEach((user) => {
        io.to(user).emit('online-users-updated', onlineUsers);
      });
    }
  });

  socket.on('send-new-message', (message) => {
    message.chat.users.forEach((user) => {
      io.to(user._id).emit('new-message-received', message);
    });
  });

  socket.on('read-all-messages', ({chatId, users, reacByUserId }) => {
    users.forEach((user) => {
      io.to(user).emit('user-read-all-chat-messages', { chatId, reacByUserId });
    });
  });

  socket.on("typing", ({ chat, senderId, senderName }) => {
    chat.users.forEach((user) => {
      if (user._id !== senderId)
        io.to(user._id).emit("typing", { chat, senderName });
    });
  });

  socket.on('logout', (userId) => {
    socket.leave(userId);
    onlineUsers = onlineUsers.filter((user) => user !== userId);

    onlineUsers.forEach((user) => {
      io.to(user).emit('online-users-updated', onlineUsers);
    });
  });
});

app.get('/', (req, res) => {
  return res.send('Chat App Node JS + Socket Server');
});

