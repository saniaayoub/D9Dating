const io = require('socket.io')();

io.on('connection', (client) => {
  console.log('a user connected');

  client.on('send message', (data) => {
    console.log(data);
    io.emit('receive message', data);
  });

  client.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.listen(3000);