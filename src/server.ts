import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import http from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http'; 
import { initSocketIO, getSocketIO } from './socket';
import mongoose, { ConnectOptions } from 'mongoose';
import taskRouter from './routers/tasksRouter';
import userRouter from './routers/userRouter';



const app = express();
const server = http.createServer(app) as HTTPServer;

initSocketIO(server); 

const mongodb = 'mongodb+srv://Oluchi:R$!RqLQXhK.dL7Y@cluster0.nhqc6ih.mongodb.net/taskManagementSystem';
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

const ioPromise = getSocketIO(); 
ioPromise.then(io => {
  io.on('connection', (socket: Socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
}).catch(error => {
  console.error('Error getting Socket.IO server instance:', error.message);
});

const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
