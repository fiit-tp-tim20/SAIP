import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:8000/ws/turn_info/';
const token = localStorage.getItem("token");

export const socket = io('ws://localhost:8000', {
    path: "/ws/turn_info/",
    transports: ['websocket'],
    query: { token: token }
});