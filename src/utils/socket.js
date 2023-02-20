import {io} from 'socket.io-client';
const URL = 'http://localhost:8080';
const socket = io('http://192.168.18.80:3000', {autoConnect: false});

// const socket = io(URL, {autoConnect: false});
export default socket;
