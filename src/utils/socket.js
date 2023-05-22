import io from 'socket.io-client';
// const socket = io('https://d9dating.herokuapp.com', {autoConnect: false});
const socket = io('http://192.168.18.75:3000');
// const socket = io('http://192.168.0.109:3000', {autoConnect: false});

socket.on('connect_error', error => {
  console.log('Connection error:', error);
});

export default socket;
