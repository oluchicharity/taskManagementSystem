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
const taskModel_1 = __importDefault(require("../models/taskModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { title, description } = req.body;
        if (!title || !description) {
            res.status(400).json({ error: 'Title and description are required' });
            return;
        }
        const newTask = new taskModel_1.default({
            title,
            description,
            user: userId
        });
        const savedTask = yield newTask.save();
        res.status(201).json(savedTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.create = create;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const tasks = yield taskModel_1.default.find({ user: userId });
        if (!tasks || tasks.length === 0) {
            res.status(404).json({ error: 'No tasks found for this user' });
            return;
        }
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.getAllTasks = getAllTasks;
const getOneTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const taskId = req.params.id;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const task = yield taskModel_1.default.findOne({ _id: taskId, user: userId });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getOneTask = getOneTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const taskId = req.params.id;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        if (!taskId || !userId) {
            res.status(400).json({ error: 'Invalid request' });
        }
        const { title, description } = req.body;
        if (!title || !description) {
            res.status(400).json({ error: 'Title and description are required' });
        }
        const updatedTask = yield taskModel_1.default.findOneAndUpdate({ _id: taskId, user: userId }, { title, description }, { new: true });
        // Check if the task exists
        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const taskId = req.params.id;
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        // Check if taskId or userId is undefined
        if (!taskId || !userId) {
            res.status(400).json({ error: 'Invalid request' });
        }
        // Find the task by ID and user ID
        const task = yield taskModel_1.default.findOneAndDelete({ _id: taskId, user: userId });
        // Check if the task exists
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.deleteTask = deleteTask;
