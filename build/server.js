"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket");
const mongoose_1 = __importDefault(require("mongoose"));
const tasksRouter_1 = __importDefault(require("./routers/tasksRouter"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.initSocketIO)(server);
const mongodb = 'mongodb+srv://Oluchi:R$!RqLQXhK.dL7Y@cluster0.nhqc6ih.mongodb.net/taskManagementSystem';
mongoose_1.default.connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});
app.use(express_1.default.json());
app.use('/api/users', userRouter_1.default);
app.use('/api/tasks', tasksRouter_1.default);
const ioPromise = (0, socket_1.getSocketIO)();
ioPromise.then(io => {
    io.on('connection', (socket) => {
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
