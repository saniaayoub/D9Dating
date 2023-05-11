import io from 'socket.io-client';
const socket = io('https://d9dating.herokuapp.com');

socket.on('connect_error', error => {
  console.log('Connection error:', error);
});

export default socket;
