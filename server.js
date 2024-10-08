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

io.on('connection', (socket) => {
  socket.on('join', (payload) => {
    console.log(payload)
  })
});

app.get('/', (req, res) => {
  return res.send('Chat App Node JS + Socket Server');
});

