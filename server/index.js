const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const http = require('http').Server(app);
const cors = require('cors');
app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: '<http://localhost:4000>',
    methods: ['GET', 'POST'],
  },
});

socketIO.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`);
  // socket.emit('roomsList', chatRooms);
  const users = [];
  for (let [id, socket] of socketIO.of('/').sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socketIO.emit('users', users);
  console.log(users);
  socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
  });
  socket.on('private_message', ({content, to, timestamp}) => {
    console.log('sent,recieve', content, to);
    socket.to(to).emit('private_message', {
      content,
      from: socket.id,
      time: `${timestamp.hour}:${timestamp.mins}`,
    });
  });
  socket.on('like', ({username, to, timestamp}) => {
    console.log('like', username, to);
    socket.to(to).emit('like', {
      username,
      from: socket.id,
      time: `${timestamp.hour}:${timestamp.mins}`,
    });
  });

  socket.on('disconnect', () => {
    socket.disconnect();
    const users = [];
    for (let [id, socket] of socketIO.of('/').sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    socketIO.emit('on_disconnect', users);
    console.log('🔥: A user disconnected', users);
  });
});

socketIO.use((socket, next) => {
  const username = socket.handshake.auth.username;
  console.log(socket.handshake.auth.username, 'server');

  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
