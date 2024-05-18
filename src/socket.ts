// import { Server as SocketIOServer, Socket } from 'socket.io';
// import http from 'http';

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

import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';

let io: SocketIOServer | null = null;

export const initSocketIO = (server: http.Server): void => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
};

export const getSocketIO = (): Promise<SocketIOServer> => {
  return new Promise<SocketIOServer>((resolve, reject) => {
    if (io) {
      resolve(io);
    } else {
      reject(new Error('Socket.IO server is not initialized'));
    }
  });
};
