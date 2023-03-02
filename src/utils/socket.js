import {io} from 'socket.io-client';
const URL = 'http://localhost:8080';
const socket = io('http://10.0.2.2:3000', {autoConnect: false});

// const socket = io(URL, {autoConnect: false});
export default socket;
