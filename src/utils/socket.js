import io from 'socket.io-client';
const socket = io('http://192.168.18.226:3000', {
  autoConnect: false,
  // transports: ['websocket'],
  // secure: true,
  // port: process.env.PORT,
});

socket.on('connect_error', error => {
  console.log('Connection error:', error);
});

export default socket;
