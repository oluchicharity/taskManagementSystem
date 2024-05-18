"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getOneTask = exports.getAllTasks = exports.create = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const socket_1 = require("../socket");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { title, description, dueDate, status, priority } = req.body;
        if (!title || !description || !dueDate || !status || !priority) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        const newTask = new taskModel_1.default({
            title,
            description,
            dueDate,
            status,
            priority,
            user: userId,
        });
        const savedTask = yield newTask.save();
        yield userModel_1.default.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } });
        // Emit Socket.IO event to notify clients about the new task
        try {
            const io = yield (0, socket_1.getSocketIO)();
            io.emit('taskCreated', savedTask);
        }
        catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }
        res.status(201).json(savedTask);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.create = create;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const tasks = yield taskModel_1.default.find({ user: userId });
        if (!tasks || tasks.length === 0) {
            res.status(404).json({ error: 'No tasks found for this user' });
            return;
        }
        // Emit Socket.IO event to notify clients about the fetched tasks
        try {
            const io = yield (0, socket_1.getSocketIO)();
            io.emit('tasksFetched', tasks);
        }
        catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }
        res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.getAllTasks = getAllTasks;
const getOneTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        if (!taskId) {
            res.status(400).json({ error: 'Task ID is missing' });
            return;
        }
        const task = yield taskModel_1.default.findOne({ _id: taskId });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        // Emit Socket.IO event to notify clients about the fetched task
        try {
            const io = yield (0, socket_1.getSocketIO)();
            io.emit('taskFetched', task);
        }
        catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }
        res.json(task);
    }
    catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getOneTask = getOneTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        if (!taskId) {
            res.status(400).json({ error: 'Invalid request' });
            return;
        }
        const { title, description, dueDate, priority, status } = req.body;
        if (!title) {
            res.status(400).json({ error: 'Title is required to update this task' });
            return;
        }
        const updatedTask = yield taskModel_1.default.findOneAndUpdate({ _id: taskId }, { title, description, dueDate, priority, status }, { new: true });
        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        // Emit Socket.IO event to notify clients about the updated task
        const io = yield (0, socket_1.getSocketIO)();
        io.emit('taskUpdated', updatedTask);
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        if (!taskId) {
            res.status(400).json({ error: 'Invalid request' });
            return;
        }
        const task = yield taskModel_1.default.findOneAndDelete({ _id: taskId });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        // Emit Socket.IO event to notify clients about the deleted task
        try {
            const io = yield (0, socket_1.getSocketIO)();
            io.emit('taskDeleted', task);
        }
        catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.deleteTask = deleteTask;
