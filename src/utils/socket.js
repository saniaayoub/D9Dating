import io from 'socket.io-client';
const socket = io('https://d9dating.herokuapp.com', {
  autoConnect: false,
  transports: ['websocket'],
  secure: true,
  port: process.env.PORT,
});

socket.on('connect_error', error => {
  console.log('Connection error:', error);
});

export default socket;
