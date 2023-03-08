const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
let user = []
const io = socketio(server);
app.get('/', function (req, res) {
  res.write(`<h1>Hello socket</h1> ${PORT}`);
  res.end;
});
io.on('connection', client => {
  console.log(`⚡: ${client.id} user just connected!`);
  client.on('join', ({ id }) => {
    console.log(id, 'username')
    user.push(id)
  });
  client.on('send message', ({ text, recieverId }) => {
    // get the recipient's socket ID from the message
    const recipientSocket = io.client.get(recieverId);
    if (recipientSocket) {
      // send the message to the recipient
      recipientSocket.emit('receive message', { text });
    }
  });
  // client.on('send message', (data,) => {
  //   console.log(data);
  //   io.emit('receive message', data);
  //   // io.to(data.id).emit( 'receive message',data);
  // });
  client.on('new_message', (data) => {
    // Send a notification to all connected clients
    io.emit('new_message_notification', data);
  });
  // client.on( 'sendNotification', (data) =>{
  //   console.log(data.message);
  //   io.emit( 'show_notification', data)
  // });

  client.on('disconnect', () => {
    console.log('user disconnected');
  });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
