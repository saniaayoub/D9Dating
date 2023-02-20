// const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');

const io = socketio(server);
app.get('/', function (req, res) {
  res.write(`<h1>Hello socket</h1> ${PORT}`);
  res.end;
});
io.on('connection', client => {
  console.log(`⚡: ${client.id} user just connected!`);

  // client.on('send message', (data) => {
  //   console.log(data);
  //   io.emit('receive message', data);
  //   // client.broadcast.to(message.recieverId).emit( 'message',`${obj}`);
  // });

  client.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.use((socket, next) => {
  console.log('here come');
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
