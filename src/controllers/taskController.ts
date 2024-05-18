import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/userModel';
import Task from '../models/taskModel';
import dotenv from 'dotenv';
dotenv.config();
import { getSocketIO } from '../socket';

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;

        const { title, description, dueDate, status, priority} = req.body;

        if (!title || !description || !dueDate || !status || !priority) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            status,
            priority,
            user: userId,
        });

        const savedTask = await newTask.save();

        await User.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } });


        // Emit Socket.IO event to notify clients about the new task
        try {
            const io = await getSocketIO();
            io.emit('taskCreated', savedTask);
        } catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }

        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};


export const getAllTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.id; 

        const tasks = await Task.find({ user: userId });

        if (!tasks || tasks.length === 0) {
            res.status(404).json({ error: 'No tasks found for this user' });
            return;
        }

        // Emit Socket.IO event to notify clients about the fetched tasks
        try {
            const io = await getSocketIO();
            io.emit('tasksFetched', tasks);
        } catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};
export const getOneTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const taskId = req.params.taskId; 

        if (!taskId ) {
            res.status(400).json({ error: 'Task ID is missing' });
            return;
        }

        const task = await Task.findOne({ _id: taskId });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // Emit Socket.IO event to notify clients about the fetched task
        try {
            const io = await getSocketIO();
            io.emit('taskFetched', task);
        } catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }

        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId },
            { title, description, dueDate, priority, status },
            { new: true }
        );

        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Emit Socket.IO event to notify clients about the updated task
        const io = await getSocketIO();
        io.emit('taskUpdated', updatedTask);

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};


export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const taskId = req.params.taskId;
        
        if (!taskId ) {
            res.status(400).json({ error: 'Invalid request' });
            return;
        }

        const task = await Task.findOneAndDelete({ _id: taskId });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Emit Socket.IO event to notify clients about the deleted task
        try {
            const io = await getSocketIO();
            io.emit('taskDeleted', task);
        } catch (socketError) {
            console.error('Socket.IO Error:', socketError);
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};