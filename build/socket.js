"use strict";
// import { Server as SocketIOServer, Socket } from 'socket.io';
// import http from 'http';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketIO = exports.initSocketIO = void 0;
// let io: SocketIOServer | null = null;
// export const initSocketIO = (server: http.Server): void => {
//   io = new SocketIOServer(server, {
//     cors: {
//       origin: '*',
//     },
//   });
//   io.on('connection', (socket: Socket) => {
//     console.log('A client connected');
//     socket.on('disconnect', () => {
//       console.log('A client disconnected');
//     });
//   });
// };
// export default io;
const socket_io_1 = require("socket.io");
let io = null;
const initSocketIO = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.on('connection', (socket) => {
        console.log('A client connected');
        socket.on('disconnect', () => {
            console.log('A client disconnected');
        });
    });
};
exports.initSocketIO = initSocketIO;
const getSocketIO = () => {
    return new Promise((resolve, reject) => {
        if (io) {
            resolve(io);
        }
        else {
            reject(new Error('Socket.IO server is not initialized'));
        }
    });
};
exports.getSocketIO = getSocketIO;
